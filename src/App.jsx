import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Users, DollarSign, BookOpen, CheckSquare, Calendar, Plus, Search, Edit, Trash2 } from 'lucide-react'
import './App.css'

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5FWj9VrwO1SPVT3wINDGPPY3sCV2k47krZ9-AN_tzvCXW-sxWyvk7B_-xmaXLBdTWxA/exec'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [teachers, setTeachers] = useState([])
  const [tasks, setTasks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)

  // Form states
  const [studentForm, setStudentForm] = useState({
    'Student ID': '',
    'Student Name': '',
    'Date of Birth': '',
    'Gender': '',
    'Father\'s Name': '',
    'Mother\'s Name': '',
    'Contact Number': '',
    'Email Address': '',
    'Address': '',
    'Admission Date': '',
    'Class/Grade': ''
  })

  const [feeForm, setFeeForm] = useState({
    'Fee ID': '',
    'Student ID': '',
    'Fee Type': '',
    'Amount Due': '',
    'Amount Paid': '',
    'Due Date': '',
    'Payment Date': '',
    'Payment Status': 'Pending'
  })

  const [teacherForm, setTeacherForm] = useState({
    'Teacher ID': '',
    'Teacher Name': '',
    'Contact Number': '',
    'Email Address': '',
    'Subject Taught': '',
    'Date of Joining': '',
    'Address': ''
  })

  const [taskForm, setTaskForm] = useState({
    'Task ID': '',
    'Task Name': '',
    'Description': '',
    'Assigned To': '',
    'Due Date': '',
    'Status': 'Pending'
  })

  const [attendanceForm, setAttendanceForm] = useState({
    'Attendance ID': '',
    'Student ID/Teacher ID': '',
    'Date': '',
    'Status': '',
    'Remarks': ''
  })

  // Fetch data from Google Sheets
  const fetchData = async (sheetName) => {
    setLoading(true)
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getSheetData',
          data: { sheetName }
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Add data to Google Sheets
  const addData = async (action, data) => {
    setLoading(true)
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          data
        })
      })
      const result = await response.json()
      if (result.success) {
        // Refresh data after successful addition
        await loadAllData()
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding data:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Load all data
  const loadAllData = async () => {
    const [studentsData, feesData, teachersData, tasksData, attendanceData] = await Promise.all([
      fetchData('New Student Registration'),
      fetchData('Fees'),
      fetchData('Teachers'),
      fetchData('Tasks'),
      fetchData('Attendance')
    ])
    
    setStudents(studentsData)
    setFees(feesData)
    setTeachers(teachersData)
    setTasks(tasksData)
    setAttendance(attendanceData)
  }

  useEffect(() => {
    loadAllData()
  }, [])

  // Handle form submissions
  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    const success = await addData('addStudent', studentForm)
    if (success) {
      setStudentForm({
        'Student ID': '',
        'Student Name': '',
        'Date of Birth': '',
        'Gender': '',
        'Father\'s Name': '',
        'Mother\'s Name': '',
        'Contact Number': '',
        'Email Address': '',
        'Address': '',
        'Admission Date': '',
        'Class/Grade': ''
      })
      alert('Student added successfully!')
    } else {
      alert('Error adding student')
    }
  }

  const handleFeeSubmit = async (e) => {
    e.preventDefault()
    const success = await addData('addFee', feeForm)
    if (success) {
      setFeeForm({
        'Fee ID': '',
        'Student ID': '',
        'Fee Type': '',
        'Amount Due': '',
        'Amount Paid': '',
        'Due Date': '',
        'Payment Date': '',
        'Payment Status': 'Pending'
      })
      alert('Fee record added successfully!')
    } else {
      alert('Error adding fee record')
    }
  }

  const handleTeacherSubmit = async (e) => {
    e.preventDefault()
    const success = await addData('addTeacher', teacherForm)
    if (success) {
      setTeacherForm({
        'Teacher ID': '',
        'Teacher Name': '',
        'Contact Number': '',
        'Email Address': '',
        'Subject Taught': '',
        'Date of Joining': '',
        'Address': ''
      })
      alert('Teacher added successfully!')
    } else {
      alert('Error adding teacher')
    }
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    const success = await addData('addTask', taskForm)
    if (success) {
      setTaskForm({
        'Task ID': '',
        'Task Name': '',
        'Description': '',
        'Assigned To': '',
        'Due Date': '',
        'Status': 'Pending'
      })
      alert('Task added successfully!')
    } else {
      alert('Error adding task')
    }
  }

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault()
    const success = await addData('addAttendance', attendanceForm)
    if (success) {
      setAttendanceForm({
        'Attendance ID': '',
        'Student ID/Teacher ID': '',
        'Date': '',
        'Status': '',
        'Remarks': ''
      })
      alert('Attendance record added successfully!')
    } else {
      alert('Error adding attendance record')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">School Management System</h1>
          <p className="text-gray-600">Manage students, fees, teachers, tasks, and attendance efficiently</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Fees
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teachers
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Attendance
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teachers.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.filter(task => task.Status === 'Pending').length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fee Records</CardTitle>
                  <DollarSign className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fees.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {students.slice(0, 5).map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{student['Student Name']}</span>
                        <Badge variant="secondary">{student['Class/Grade']}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {fees.filter(fee => fee['Payment Status'] === 'Pending').slice(0, 5).map((fee, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">Student ID: {fee['Student ID']}</span>
                        <Badge variant="destructive">${fee['Amount Due']}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={studentForm['Student ID']}
                      onChange={(e) => setStudentForm({...studentForm, 'Student ID': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      value={studentForm['Student Name']}
                      onChange={(e) => setStudentForm({...studentForm, 'Student Name': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={studentForm['Date of Birth']}
                      onChange={(e) => setStudentForm({...studentForm, 'Date of Birth': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={studentForm['Gender']} onValueChange={(value) => setStudentForm({...studentForm, 'Gender': value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      value={studentForm['Father\'s Name']}
                      onChange={(e) => setStudentForm({...studentForm, 'Father\'s Name': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      value={studentForm['Mother\'s Name']}
                      onChange={(e) => setStudentForm({...studentForm, 'Mother\'s Name': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      value={studentForm['Contact Number']}
                      onChange={(e) => setStudentForm({...studentForm, 'Contact Number': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={studentForm['Email Address']}
                      onChange={(e) => setStudentForm({...studentForm, 'Email Address': e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admissionDate">Admission Date</Label>
                    <Input
                      id="admissionDate"
                      type="date"
                      value={studentForm['Admission Date']}
                      onChange={(e) => setStudentForm({...studentForm, 'Admission Date': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="classGrade">Class/Grade</Label>
                    <Input
                      id="classGrade"
                      value={studentForm['Class/Grade']}
                      onChange={(e) => setStudentForm({...studentForm, 'Class/Grade': e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={studentForm['Address']}
                      onChange={(e) => setStudentForm({...studentForm, 'Address': e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Adding...' : 'Add Student'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class/Grade</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Admission Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student['Student ID']}</TableCell>
                        <TableCell>{student['Student Name']}</TableCell>
                        <TableCell>{student['Class/Grade']}</TableCell>
                        <TableCell>{student['Contact Number']}</TableCell>
                        <TableCell>{student['Admission Date']}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Fee Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feeId">Fee ID</Label>
                    <Input
                      id="feeId"
                      value={feeForm['Fee ID']}
                      onChange={(e) => setFeeForm({...feeForm, 'Fee ID': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="feeStudentId">Student ID</Label>
                    <Input
                      id="feeStudentId"
                      value={feeForm['Student ID']}
                      onChange={(e) => setFeeForm({...feeForm, 'Student ID': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select value={feeForm['Fee Type']} onValueChange={(value) => setFeeForm({...feeForm, 'Fee Type': value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Fee Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admission Fee">Admission Fee</SelectItem>
                        <SelectItem value="Monthly Fee">Monthly Fee</SelectItem>
                        <SelectItem value="Exam Fee">Exam Fee</SelectItem>
                        <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amountDue">Amount Due</Label>
                    <Input
                      id="amountDue"
                      type="number"
                      value={feeForm['Amount Due']}
                      onChange={(e) => setFeeForm({...feeForm, 'Amount Due': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amountPaid">Amount Paid</Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      value={feeForm['Amount Paid']}
                      onChange={(e) => setFeeForm({...feeForm, 'Amount Paid': e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={feeForm['Due Date']}
                      onChange={(e) => setFeeForm({...feeForm, 'Due Date': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={feeForm['Payment Date']}
                      onChange={(e) => setFeeForm({...feeForm, 'Payment Date': e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select value={feeForm['Payment Status']} onValueChange={(value) => setFeeForm({...feeForm, 'Payment Status': value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Adding...' : 'Add Fee Record'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fee Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee ID</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees.map((fee, index) => (
                      <TableRow key={index}>
                        <TableCell>{fee['Fee ID']}</TableCell>
                        <TableCell>{fee['Student ID']}</TableCell>
                        <TableCell>{fee['Fee Type']}</TableCell>
                        <TableCell>${fee['Amount Due']}</TableCell>
                        <TableCell>${fee['Amount Paid']}</TableCell>
                        <TableCell>
                          <Badge variant={fee['Payment Status'] === 'Paid' ? 'default' : fee['Payment Status'] === 'Overdue' ? 'destructive' : 'secondary'}>
                            {fee['Payment Status']}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Teacher
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTeacherSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teacherId">Teacher ID</Label>
                    <Input
                      id="teacherId"
                      value={teacherForm['Teacher ID']}
                      onChange={(e) => setTeacherForm({...teacherForm, 'Teacher ID': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherName">Teacher Name</Label>
                    <Input
                      id="teacherName"
                      value={teacherForm['Teacher Name']}
                      onChange={(e) => setTeacherForm({...teacherForm, 'Teacher Name': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherContact">Contact Number</Label>
                    <Input
                      id="teacherContact"
                      value={teacherForm['Contact Number']}
                      onChange={(e) => setTeacherForm({...teacherForm, 'Contact Number': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherEmail">Email Address</Label>
                    <Input
                      id="teacherEmail"
                      type="email"
                      value={teacherForm['Email Address']}
                      onChange={(e) => setTeacherForm({...teacherForm, 'Email Address': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subjectTaught">Subject Taught</Label>
                    <Input
                      id="subjectTaught"
                      value={teacherForm['Subject Taught']}
                      onChange={(e) => setTeacherForm({...teacherForm, 'Subject Taught': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfJoining">Date of Joining</Label>
                    <Input
                      id="dateOfJoining"
                      type="date"
                      value={teacherForm['Date of Joining']}
                      onChange={(e) => setTeacherForm({...teacherForm, 'Date of Joining': e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="teacherAddress">Address</Label>
                    <Textarea
                      id="teacherAddress"
                      value={teacherForm['Address']}
                      onChange={(e) => setTeacherForm({...teacherForm, 'Address': e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Adding...' : 'Add Teacher'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teachers List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher, index) => (
                      <TableRow key={index}>
                        <TableCell>{teacher['Teacher ID']}</TableCell>
                        <TableCell>{teacher['Teacher Name']}</TableCell>
                        <TableCell>{teacher['Subject Taught']}</TableCell>
                        <TableCell>{teacher['Contact Number']}</TableCell>
                        <TableCell>{teacher['Email Address']}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTaskSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taskId">Task ID</Label>
                    <Input
                      id="taskId"
                      value={taskForm['Task ID']}
                      onChange={(e) => setTaskForm({...taskForm, 'Task ID': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskName">Task Name</Label>
                    <Input
                      id="taskName"
                      value={taskForm['Task Name']}
                      onChange={(e) => setTaskForm({...taskForm, 'Task Name': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      value={taskForm['Assigned To']}
                      onChange={(e) => setTaskForm({...taskForm, 'Assigned To': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDueDate">Due Date</Label>
                    <Input
                      id="taskDueDate"
                      type="date"
                      value={taskForm['Due Date']}
                      onChange={(e) => setTaskForm({...taskForm, 'Due Date': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskStatus">Status</Label>
                    <Select value={taskForm['Status']} onValueChange={(value) => setTaskForm({...taskForm, 'Status': value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea
                      id="taskDescription"
                      value={taskForm['Description']}
                      onChange={(e) => setTaskForm({...taskForm, 'Description': e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Adding...' : 'Add Task'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasks List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableHead>Task Name</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task, index) => (
                      <TableRow key={index}>
                        <TableCell>{task['Task ID']}</TableCell>
                        <TableCell>{task['Task Name']}</TableCell>
                        <TableCell>{task['Assigned To']}</TableCell>
                        <TableCell>{task['Due Date']}</TableCell>
                        <TableCell>
                          <Badge variant={task['Status'] === 'Completed' ? 'default' : 'secondary'}>
                            {task['Status']}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Attendance Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAttendanceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="attendanceId">Attendance ID</Label>
                    <Input
                      id="attendanceId"
                      value={attendanceForm['Attendance ID']}
                      onChange={(e) => setAttendanceForm({...attendanceForm, 'Attendance ID': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentTeacherId">Student ID/Teacher ID</Label>
                    <Input
                      id="studentTeacherId"
                      value={attendanceForm['Student ID/Teacher ID']}
                      onChange={(e) => setAttendanceForm({...attendanceForm, 'Student ID/Teacher ID': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="attendanceDate">Date</Label>
                    <Input
                      id="attendanceDate"
                      type="date"
                      value={attendanceForm['Date']}
                      onChange={(e) => setAttendanceForm({...attendanceForm, 'Date': e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="attendanceStatus">Status</Label>
                    <Select value={attendanceForm['Status']} onValueChange={(value) => setAttendanceForm({...attendanceForm, 'Status': value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="attendanceRemarks">Remarks</Label>
                    <Textarea
                      id="attendanceRemarks"
                      value={attendanceForm['Remarks']}
                      onChange={(e) => setAttendanceForm({...attendanceForm, 'Remarks': e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Adding...' : 'Add Attendance Record'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attendance ID</TableHead>
                      <TableHead>Student/Teacher ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record['Attendance ID']}</TableCell>
                        <TableCell>{record['Student ID/Teacher ID']}</TableCell>
                        <TableCell>{record['Date']}</TableCell>
                        <TableCell>
                          <Badge variant={record['Status'] === 'Present' ? 'default' : record['Status'] === 'Late' ? 'secondary' : 'destructive'}>
                            {record['Status']}
                          </Badge>
                        </TableCell>
                        <TableCell>{record['Remarks']}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

