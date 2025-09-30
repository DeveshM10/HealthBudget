import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  FileText, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Activity,
  Calendar,
  Phone,
  Video,
  Send,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  Info,
  X
} from "lucide-react";

interface CareTeamMember {
  id: string;
  name: string;
  role: 'primary_physician' | 'specialist' | 'nurse' | 'therapist' | 'pharmacist' | 'care_coordinator';
  specialty: string;
  profilePhoto?: string;
  contactInfo: {
    phone: string;
    email: string;
    hospital: string;
  };
  joinedDate: string;
  isActive: boolean;
  lastActivity: string;
}

interface Referral {
  id: string;
  fromDoctorId: string;
  fromDoctorName: string;
  toDoctorId: string;
  toDoctorName: string;
  specialty: string;
  priority: 'routine' | 'urgent' | 'emergency';
  reason: string;
  clinicalNotes: string;
  attachments: string[];
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  requestedDate: string;
  appointmentDate?: string;
  responseNotes?: string;
}

interface CommunicationThread {
  id: string;
  subject: string;
  participants: string[]; // doctor IDs
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    attachments?: string[];
    isUrgent: boolean;
  }[];
  status: 'active' | 'archived';
  createdAt: string;
  lastActivity: string;
}

interface HandoffRecord {
  id: string;
  fromDoctorId: string;
  fromDoctorName: string;
  toDoctorId: string;
  toDoctorName: string;
  patientCondition: string;
  handoffReason: string;
  clinicalSummary: string;
  currentMedications: string[];
  pendingTasks: string[];
  urgentAlerts: string[];
  handoffDate: string;
  status: 'pending' | 'accepted' | 'completed';
}

interface CareCoordinationProps {
  patientId: string;
  careTeam: CareTeamMember[];
  referrals: Referral[];
  communications: CommunicationThread[];
  handoffs: HandoffRecord[];
  onAddTeamMember?: (member: Partial<CareTeamMember>) => void;
  onCreateReferral?: (referral: Partial<Referral>) => void;
  onSendMessage?: (threadId: string, message: string, isUrgent: boolean) => void;
  onHandoffPatient?: (handoff: Partial<HandoffRecord>) => void;
}

const roleColors = {
  primary_physician: 'bg-blue-50 text-blue-700 border-blue-200',
  specialist: 'bg-purple-50 text-purple-700 border-purple-200',
  nurse: 'bg-green-50 text-green-700 border-green-200',
  therapist: 'bg-orange-50 text-orange-700 border-orange-200',
  pharmacist: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  care_coordinator: 'bg-indigo-50 text-indigo-700 border-indigo-200'
};

const priorityColors = {
  routine: 'bg-green-50 text-green-700 border-green-200',
  urgent: 'bg-orange-50 text-orange-700 border-orange-200',
  emergency: 'bg-red-50 text-red-700 border-red-200'
};

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  active: 'bg-blue-50 text-blue-700 border-blue-200',
  archived: 'bg-gray-50 text-gray-700 border-gray-200'
};

export default function CareCoordination({ 
  patientId,
  careTeam,
  referrals,
  communications,
  handoffs,
  onAddTeamMember,
  onCreateReferral,
  onSendMessage,
  onHandoffPatient 
}: CareCoordinationProps) {
  
  const [activeTab, setActiveTab] = useState("team");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [selectedThread, setSelectedThread] = useState<CommunicationThread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSendMessage = () => {
    if (selectedThread && newMessage.trim()) {
      onSendMessage?.(selectedThread.id, newMessage, isUrgent);
      setNewMessage("");
      setIsUrgent(false);
      console.log('Message sent:', { threadId: selectedThread.id, message: newMessage, isUrgent });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'primary_physician': return <Stethoscope className="h-4 w-4" />;
      case 'specialist': return <Heart className="h-4 w-4" />;
      case 'nurse': return <Users className="h-4 w-4" />;
      case 'therapist': return <Activity className="h-4 w-4" />;
      case 'pharmacist': return <Brain className="h-4 w-4" />;
      case 'care_coordinator': return <UserPlus className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Care Team Coordination
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Manage care team, referrals, and communication for comprehensive patient care
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowReferral(true)}
                data-testid="button-create-referral"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Create Referral
              </Button>
              <Button 
                onClick={() => setShowAddMember(true)}
                data-testid="button-add-team-member"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Care Coordination Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="team">Care Team ({careTeam.length})</TabsTrigger>
          <TabsTrigger value="referrals">Referrals ({referrals.length})</TabsTrigger>
          <TabsTrigger value="communications">Messages ({communications.length})</TabsTrigger>
          <TabsTrigger value="handoffs">Handoffs ({handoffs.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Care Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careTeam.map((member) => (
              <Card key={member.id} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.profilePhoto} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Dr. {member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.specialty}</p>
                      </div>
                    </div>
                    <Badge className={roleColors[member.role]}>
                      {getRoleIcon(member.role)}
                      <span className="ml-1">{formatRole(member.role)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{member.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{member.contactInfo.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>Last active: {member.lastActivity}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" data-testid={`button-message-${member.id}`}>
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" data-testid={`button-call-${member.id}`}>
                      <Video className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>

                  {member.role === 'primary_physician' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowHandoff(true)}
                      data-testid={`button-handoff-${member.id}`}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Patient Handoff
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <div className="space-y-4">
            {referrals.map((referral) => (
              <Card key={referral.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        Referral to {referral.specialty}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        From Dr. {referral.fromDoctorName} to Dr. {referral.toDoctorName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={priorityColors[referral.priority]}>
                        {referral.priority}
                      </Badge>
                      <Badge className={statusColors[referral.status]}>
                        {referral.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Reason for Referral:</h4>
                    <p className="text-sm">{referral.reason}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Clinical Notes:</h4>
                    <p className="text-sm text-muted-foreground">{referral.clinicalNotes}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Requested: {referral.requestedDate}</span>
                    </div>
                    {referral.appointmentDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Scheduled: {referral.appointmentDate}</span>
                      </div>
                    )}
                  </div>

                  {referral.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" data-testid={`button-approve-${referral.id}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`button-schedule-${referral.id}`}>
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thread List */}
            <div className="space-y-4">
              <h3 className="font-semibold">Communication Threads</h3>
              {communications.map((thread) => (
                <Card 
                  key={thread.id} 
                  className={`cursor-pointer hover-elevate ${selectedThread?.id === thread.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{thread.subject}</h4>
                      <Badge className={statusColors[thread.status]}>
                        {thread.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {thread.participants.length} participants
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last activity: {thread.lastActivity}</span>
                      <span>{thread.messages.length} messages</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Message Thread */}
            {selectedThread && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{selectedThread.subject}</h3>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setSelectedThread(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {selectedThread.messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{message.senderName}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          {message.isUrgent && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm bg-muted/30 p-3 rounded-lg">{message.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t pt-4 space-y-3">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[80px]"
                      data-testid="textarea-new-message"
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="urgent"
                          checked={isUrgent}
                          onChange={(e) => setIsUrgent(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="urgent" className="text-sm">Mark as urgent</label>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        data-testid="button-send-message"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Handoffs Tab */}
        <TabsContent value="handoffs" className="space-y-6">
          <div className="space-y-4">
            {handoffs.map((handoff) => (
              <Card key={handoff.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Patient Handoff</h3>
                      <p className="text-sm text-muted-foreground">
                        From Dr. {handoff.fromDoctorName} to Dr. {handoff.toDoctorName}
                      </p>
                    </div>
                    <Badge className={statusColors[handoff.status]}>
                      {handoff.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Patient Condition:</h4>
                    <p className="text-sm">{handoff.patientCondition}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Handoff Reason:</h4>
                    <p className="text-sm">{handoff.handoffReason}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Clinical Summary:</h4>
                    <p className="text-sm text-muted-foreground">{handoff.clinicalSummary}</p>
                  </div>

                  {handoff.urgentAlerts.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-red-700">Urgent Alerts:</h4>
                      <div className="space-y-1">
                        {handoff.urgentAlerts.map((alert, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-red-700">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{alert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Handoff Date: {handoff.handoffDate}</span>
                    </div>
                  </div>

                  {handoff.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" data-testid={`button-accept-handoff-${handoff.id}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept Handoff
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`button-request-info-${handoff.id}`}>
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Request More Info
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Care Coordination Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Timeline items would be rendered here */}
                <div className="text-center text-muted-foreground py-8">
                  Care coordination timeline coming soon...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Team Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Care Team Member</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowAddMember(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="member-name">Doctor Name</Label>
                <Input
                  id="member-name"
                  placeholder="Enter doctor's name"
                  data-testid="input-member-name"
                />
              </div>

              <div>
                <Label htmlFor="member-role">Role</Label>
                <Select>
                  <SelectTrigger data-testid="select-member-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary_physician">Primary Physician</SelectItem>
                    <SelectItem value="specialist">Specialist</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="care_coordinator">Care Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="member-specialty">Specialty</Label>
                <Input
                  id="member-specialty"
                  placeholder="e.g., Cardiology, Neurology"
                  data-testid="input-member-specialty"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    onAddTeamMember?.({});
                    setShowAddMember(false);
                  }}
                  className="flex-1"
                  data-testid="button-add-member-confirm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddMember(false)}
                  data-testid="button-add-member-cancel"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}