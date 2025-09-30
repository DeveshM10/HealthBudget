import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Download, 
  Share2, 
  Eye, 
  Calendar, 
  User,
  Hospital,
  Stethoscope,
  Activity,
  TestTube,
  Pill,
  Heart,
  Brain,
  Camera,
  FileImage,
  Shield,
  Lock,
  Clock,
  Search,
  Filter,
  Plus,
  X
} from "lucide-react";

interface MedicalDocument {
  id: string;
  fileName: string;
  documentType: 'lab_report' | 'prescription' | 'imaging' | 'consultation_notes' | 'discharge_summary' | 'insurance_claim' | 'referral' | 'vaccination_record';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadDate: string;
  documentDate: string;
  issuingProvider: string;
  tags: string[];
  isActive: boolean;
  sharedWith: {
    doctorId: string;
    doctorName: string;
    sharedAt: string;
    accessLevel: 'view' | 'download' | 'full';
  }[];
  summary: string;
  expiryDate?: string;
  patientId: string;
  consultationId?: string;
}

interface DocumentShare {
  doctorId: string;
  doctorName: string;
  accessLevel: 'view' | 'download' | 'full';
  expiresAt?: string;
}

interface MedicalDocumentManagerProps {
  patientId: string;
  documents: MedicalDocument[];
  onUploadDocument?: (file: File, metadata: Partial<MedicalDocument>) => void;
  onShareDocument?: (documentId: string, shareInfo: DocumentShare) => void;
  onDownloadDocument?: (documentId: string) => void;
  onDeleteDocument?: (documentId: string) => void;
}

const documentTypes = [
  { value: 'lab_report', label: 'Lab Report', icon: <TestTube className="h-4 w-4" />, color: 'bg-blue-50 text-blue-700' },
  { value: 'prescription', label: 'Prescription', icon: <Pill className="h-4 w-4" />, color: 'bg-green-50 text-green-700' },
  { value: 'imaging', label: 'Medical Imaging', icon: <Camera className="h-4 w-4" />, color: 'bg-purple-50 text-purple-700' },
  { value: 'consultation_notes', label: 'Consultation Notes', icon: <Stethoscope className="h-4 w-4" />, color: 'bg-orange-50 text-orange-700' },
  { value: 'discharge_summary', label: 'Discharge Summary', icon: <Hospital className="h-4 w-4" />, color: 'bg-red-50 text-red-700' },
  { value: 'insurance_claim', label: 'Insurance Claim', icon: <Shield className="h-4 w-4" />, color: 'bg-yellow-50 text-yellow-700' },
  { value: 'referral', label: 'Medical Referral', icon: <User className="h-4 w-4" />, color: 'bg-indigo-50 text-indigo-700' },
  { value: 'vaccination_record', label: 'Vaccination Record', icon: <Heart className="h-4 w-4" />, color: 'bg-pink-50 text-pink-700' }
];

export default function MedicalDocumentManager({ 
  patientId, 
  documents, 
  onUploadDocument,
  onShareDocument,
  onDownloadDocument,
  onDeleteDocument 
}: MedicalDocumentManagerProps) {
  
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<MedicalDocument | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState<Partial<MedicalDocument>>({
    documentType: 'lab_report',
    tags: [],
    isActive: true
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.issuingProvider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "" || doc.documentType === selectedType;
    return matchesSearch && matchesType;
  });

  const getDocumentTypeInfo = (type: string) => {
    return documentTypes.find(dt => dt.value === type) || documentTypes[0];
  };

  const handleUpload = () => {
    // In a real implementation, this would handle file upload
    console.log('Upload document with metadata:', uploadMetadata);
    setShowUploadModal(false);
    onUploadDocument?.(new File([], ""), uploadMetadata);
  };

  const handleShare = (shareInfo: DocumentShare) => {
    if (selectedDocument) {
      onShareDocument?.(selectedDocument.id, shareInfo);
      setShowShareModal(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'view': return 'bg-blue-50 text-blue-700';
      case 'download': return 'bg-green-50 text-green-700';
      case 'full': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Medical Document Manager
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Secure storage and sharing of medical records
              </p>
            </div>
            <Button 
              onClick={() => setShowUploadModal(true)}
              data-testid="button-upload-document"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents by name, provider, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-documents"
                />
              </div>
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-document-type">
                <SelectValue placeholder="All document types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All document types</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="expired">Expiring Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => {
              const typeInfo = getDocumentTypeInfo(document.documentType);
              return (
                <Card key={document.id} className="hover-elevate">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={typeInfo.color}>
                          {typeInfo.icon}
                          <span className="ml-1">{typeInfo.label}</span>
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onDownloadDocument?.(document.id)}
                          data-testid={`button-download-${document.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedDocument(document);
                            setShowShareModal(true);
                          }}
                          data-testid={`button-share-${document.id}`}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm truncate" title={document.fileName}>
                        {document.fileName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(document.fileSize)} • {document.mimeType}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Hospital className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{document.issuingProvider}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{document.documentDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>Uploaded by {document.uploadedBy}</span>
                      </div>
                    </div>

                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{document.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {document.summary && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {document.summary}
                      </p>
                    )}

                    {document.sharedWith.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Share2 className="h-3 w-3 text-muted-foreground" />
                        <span>Shared with {document.sharedWith.length} doctor(s)</span>
                      </div>
                    )}

                    {document.expiryDate && (
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <Clock className="h-3 w-3" />
                        <span>Expires: {document.expiryDate}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-4">
            {filteredDocuments
              .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
              .slice(0, 10)
              .map((document) => {
                const typeInfo = getDocumentTypeInfo(document.documentType);
                return (
                  <Card key={document.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                            {typeInfo.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{document.fileName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {document.issuingProvider} • {document.documentDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" data-testid={`button-view-${document.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-download-recent-${document.id}`}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <div className="space-y-4">
            {filteredDocuments
              .filter(doc => doc.sharedWith.length > 0)
              .map((document) => {
                const typeInfo = getDocumentTypeInfo(document.documentType);
                return (
                  <Card key={document.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                            {typeInfo.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{document.fileName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {document.issuingProvider} • {document.documentDate}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          {document.sharedWith.length} sharing(s)
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Shared with:</h4>
                        {document.sharedWith.map((share, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Dr. {share.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getAccessLevelColor(share.accessLevel)}`}>
                                {share.accessLevel}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {share.sharedAt}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <div className="space-y-4">
            {filteredDocuments
              .filter(doc => doc.expiryDate && new Date(doc.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
              .map((document) => {
                const typeInfo = getDocumentTypeInfo(document.documentType);
                const isExpired = document.expiryDate && new Date(document.expiryDate) < new Date();
                return (
                  <Card key={document.id} className={isExpired ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                            {typeInfo.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{document.fileName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {document.issuingProvider} • {document.documentDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={isExpired ? "destructive" : "outline"} className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {isExpired ? "Expired" : "Expires Soon"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {document.expiryDate}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Medical Document</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select 
                  value={uploadMetadata.documentType || ""} 
                  onValueChange={(value) => setUploadMetadata(prev => ({ ...prev, documentType: value as any }))}
                >
                  <SelectTrigger data-testid="select-upload-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="issuing-provider">Issuing Provider</Label>
                <Input
                  id="issuing-provider"
                  value={uploadMetadata.issuingProvider || ""}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, issuingProvider: e.target.value }))}
                  placeholder="Hospital or clinic name"
                  data-testid="input-issuing-provider"
                />
              </div>

              <div>
                <Label htmlFor="document-date">Document Date</Label>
                <Input
                  id="document-date"
                  type="date"
                  value={uploadMetadata.documentDate || ""}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, documentDate: e.target.value }))}
                  data-testid="input-document-date"
                />
              </div>

              <div>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  data-testid="input-file-upload"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleUpload}
                  className="flex-1"
                  data-testid="button-upload-confirm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadModal(false)}
                  data-testid="button-upload-cancel"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Share Document</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowShareModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium">{selectedDocument.fileName}</h4>
                <p className="text-sm text-muted-foreground">{selectedDocument.issuingProvider}</p>
              </div>

              <div>
                <Label htmlFor="doctor-search">Search Doctor</Label>
                <Input
                  id="doctor-search"
                  placeholder="Search by name or ID..."
                  data-testid="input-doctor-search"
                />
              </div>

              <div>
                <Label htmlFor="access-level">Access Level</Label>
                <Select defaultValue="view">
                  <SelectTrigger data-testid="select-access-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="download">View & Download</SelectItem>
                    <SelectItem value="full">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleShare({
                    doctorId: "doc-123",
                    doctorName: "Selected Doctor",
                    accessLevel: "view"
                  })}
                  className="flex-1"
                  data-testid="button-share-confirm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowShareModal(false)}
                  data-testid="button-share-cancel"
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