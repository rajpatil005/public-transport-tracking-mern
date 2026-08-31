import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Printer,
  FileSpreadsheet,
  File,
  Clock,
  Eye,
  Share2,
  Upload,
  RefreshCw,
  DollarSign,
  Users,
  Award,
  Bus,
  Map,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { reportService } from '../../services/api';
import { handleApiError } from '../../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const reportRef = useRef();

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportService.getAll();
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = {
        reportType,
        startDate,
        endDate,
        format: 'PDF'
      };
      
      const response = await reportService.generate(data);
      if (response.data.success) {
        await fetchReports();
        alert('Report generated successfully!');
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
      alert(errorResponse.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async (report) => {
    try {
      // Create a temporary div for the report content
      const reportContent = document.createElement('div');
      reportContent.style.padding = '40px';
      reportContent.style.backgroundColor = 'white';
      reportContent.style.width = '800px';
      reportContent.style.fontFamily = 'Arial, sans-serif';
      
      const data = report.data || {};
      
      reportContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
          <h1 style="color: #2563eb; font-size: 28px; margin: 0;">Kolhapur City Bus Service</h1>
          <h2 style="color: #475569; font-size: 20px; margin: 10px 0;">${report.name}</h2>
          <p style="color: #94a3b8; font-size: 14px;">Generated on: ${data.generatedAt || new Date().toLocaleString()}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Total Buses</p>
            <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 5px 0;">${data.totalBuses || 0}</p>
          </div>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Active Buses</p>
            <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 5px 0;">${data.activeBuses || 0}</p>
          </div>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Total Routes</p>
            <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 5px 0;">${data.totalRoutes || 0}</p>
          </div>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Total Drivers</p>
            <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 5px 0;">${data.totalDrivers || 0}</p>
          </div>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <h3 style="color: #1e293b; font-size: 16px;">Summary</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
              <span style="color: #64748b;">Total Revenue:</span>
              <span style="float: right; font-weight: bold;">₹${(data.revenue || 0).toLocaleString()}</span>
            </li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
              <span style="color: #64748b;">Total Passengers:</span>
              <span style="float: right; font-weight: bold;">${(data.passengers || 0).toLocaleString()}</span>
            </li>
            <li style="padding: 8px 0;">
              <span style="color: #64748b;">Generated At:</span>
              <span style="float: right; font-weight: bold;">${data.generatedAt || new Date().toLocaleString()}</span>
            </li>
          </ul>
        </div>
      `;
      
      document.body.appendChild(reportContent);
      
      // Convert to canvas and then to PDF
      const canvas = await html2canvas(reportContent, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      document.body.removeChild(reportContent);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${report.name.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const response = await reportService.delete(id);
        if (response.data.success) {
          await fetchReports();
        }
      } catch (err) {
        const errorResponse = handleApiError(err);
        alert(errorResponse.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'ready') return <Badge variant="success">✓ Ready</Badge>;
    if (status === 'generating') return <Badge variant="warning">⏳ Generating</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const viewReport = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Reports
          </h1>
          <p className="text-gray-600 mt-1">Generate and manage comprehensive reports for your fleet</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={fetchReports}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generation Panel */}
        <Card className="lg:col-span-1">
          <Card.Header>
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold">Generate New Report</h3>
            </div>
          </Card.Header>
          <Card.Body className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="daily">📊 Daily Report</option>
                  <option value="weekly">📈 Weekly Report</option>
                  <option value="monthly">📉 Monthly Report</option>
                  <option value="quarterly">📊 Quarterly Report</option>
                  <option value="custom">📅 Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {reportType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-blue-50 transition-colors bg-blue-50 border-blue-300">
                    <FileText className="h-4 w-4 mr-2 text-red-500" />
                    PDF
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-blue-50 transition-colors">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
                    Excel
                  </button>
                </div>
              </div>

              <Button 
                fullWidth 
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-400 text-center">
                <Clock className="h-3 w-3 inline mr-1" />
                Generation may take a few moments
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Reports List */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <File className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold">Available Reports</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">{reports.length} reports</span>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="divide-y">
              {reports.map((report) => (
                <div key={report._id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        report.type === 'PDF' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {report.type === 'PDF' ? (
                          <FileText className={`h-5 w-5 ${report.type === 'PDF' ? 'text-red-600' : 'text-green-600'}`} />
                        ) : (
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 flex-wrap gap-2">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.date}
                          </span>
                          <span className="text-xs text-gray-500">{report.type}</span>
                          <span className="text-xs text-gray-500">{report.size}</span>
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {report.status === 'ready' && (
                        <>
                          <button 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="View"
                            onClick={() => viewReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Download PDF"
                            onClick={() => downloadPDF(report)}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete"
                            onClick={() => handleDeleteReport(report._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {report.status === 'generating' && (
                        <div className="flex items-center text-sm text-yellow-600">
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          Generating...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No reports available</h3>
                <p className="text-gray-400 mt-1">Generate a new report to get started</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          setReportType('daily');
          handleGenerateReport();
        }}>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Quick Report</p>
                <p className="font-medium">Today's Summary</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          setReportType('weekly');
          handleGenerateReport();
        }}>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Quick Report</p>
                <p className="font-medium">Weekly Revenue</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          setReportType('monthly');
          handleGenerateReport();
        }}>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Quick Report</p>
                <p className="font-medium">Passenger Trends</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          setReportType('monthly');
          handleGenerateReport();
        }}>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Quick Report</p>
                <p className="font-medium">Driver Performance</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Report Preview Modal */}
      {showPreview && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedReport.name}</h2>
                <p className="text-sm text-gray-500">Generated on: {selectedReport.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => downloadPDF(selectedReport)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6" ref={reportRef}>
              {/* Report Preview Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Buses</p>
                    <p className="text-2xl font-bold">{selectedReport.data?.totalBuses || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Active Buses</p>
                    <p className="text-2xl font-bold">{selectedReport.data?.activeBuses || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Routes</p>
                    <p className="text-2xl font-bold">{selectedReport.data?.totalRoutes || 0}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Drivers</p>
                    <p className="text-2xl font-bold">{selectedReport.data?.totalDrivers || 0}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Detailed Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Total Revenue</span>
                      <span className="font-bold">₹{(selectedReport.data?.revenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Total Passengers</span>
                      <span className="font-bold">{(selectedReport.data?.passengers || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Generated At</span>
                      <span className="font-bold">{selectedReport.data?.generatedAt || selectedReport.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;