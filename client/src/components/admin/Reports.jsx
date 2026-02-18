// client/src/components/admin/Reports.jsx
import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Printer } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FileText className="h-6 w-6 mr-2 text-blue-600" />
        Reports
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <Card.Header>
            <h3 className="font-semibold">Generate Report</h3>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily Report</option>
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  icon={Calendar}
                />
              </div>

              {reportType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input type="date" icon={Calendar} />
                </div>
              )}

              <Button fullWidth>
                <Filter className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card className="lg:col-span-2">
          <Card.Header className="flex justify-between items-center">
            <h3 className="font-semibold">Available Reports</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button size="sm" variant="outline">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="divide-y">
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Daily Operations Report</h4>
                    <p className="text-sm text-gray-500">January 15, 2024</p>
                  </div>
                  <Badge variant="primary">PDF</Badge>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Revenue Summary - Week 2</h4>
                    <p className="text-sm text-gray-500">January 8-14, 2024</p>
                  </div>
                  <Badge variant="primary">Excel</Badge>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Passenger Statistics</h4>
                    <p className="text-sm text-gray-500">January 2024</p>
                  </div>
                  <Badge variant="primary">PDF</Badge>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Reports;