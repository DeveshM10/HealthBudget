import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const isDevNoAuth = !process.env.REPLIT_DOMAINS;

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  // In local development, fall back to in-memory session store to avoid requiring Postgres
  if (isDevNoAuth) {
    return session({
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: sessionTtl,
      },
    });
  }

  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Allow insecure cookies in dev
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Check if user already exists to avoid overriding their role
  const existingUser = await storage.getUser(claims["sub"]);
  
  const userData: any = {
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  };

  // Only set userType for new users (don't override existing roles)
  if (!existingUser || !existingUser.userType) {
    userData.userType = "patient"; // Default new users to patient role
  }

  const user = await storage.upsertUser(userData);

  // Auto-create patient profile only for users who are actually patients
  if (user.userType === 'patient') {
    const existingPatient = await storage.getPatientByUserId(user.id);
    if (!existingPatient) {
      try {
        const fullName = [claims["first_name"], claims["last_name"]]
          .filter(Boolean)
          .join(" ") || "Patient";
        
        await storage.createPatient({
          userId: user.id,
          fullName,
          dateOfBirth: "1990-01-01", // Placeholder - user can update later
          gender: "prefer_not_to_say",
          phoneNumber: "000-000-0000", // Placeholder - user can update later
          city: "Unknown",
          state: "Unknown",
          pincode: "00000",
        });
      } catch (error) {
        console.error('Error creating patient profile:', error);
        // Don't fail auth if profile creation fails
      }
    }
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  if (isDevNoAuth) {
    // Minimal no-op auth routes for local development
    app.get("/api/login", (_req, res) => res.redirect("/"));
    app.get("/api/callback", (_req, res) => res.redirect("/"));
    app.get("/api/logout", (req, res) => {
      req.logout(() => res.redirect("/"));
    });
    return;
  }

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // In local development, bypass external auth and ensure a dev user exists
  if (isDevNoAuth) {
    try {
      const devUserId = "dev-user-1";
      (req as any).user = { claims: { sub: devUserId } } as any;

      const existingUser = await storage.getUser(devUserId);
      if (!existingUser) {
        await storage.upsertUser({
          id: devUserId,
          email: "dev@example.com",
          firstName: "Dev",
          lastName: "User",
          userType: "patient",
          profileImageUrl: null,
        } as any);

        const existingPatient = await storage.getPatientByUserId(devUserId);
        if (!existingPatient) {
          await storage.createPatient({
            userId: devUserId,
            fullName: "Dev User",
            dateOfBirth: "1990-01-01",
            gender: "prefer_not_to_say",
            phoneNumber: "000-000-0000",
            city: "Local",
            state: "Local",
            pincode: "00000",
          } as any);
        }
      }
    } catch (_e) {
      // ignore errors in dev stub
    }
    return next();
  }

  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);

    // Persist refreshed tokens to session
    req.login(user, (err) => {
      if (err) {
        console.error('Error persisting refreshed session:', err);
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      return next();
    });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};