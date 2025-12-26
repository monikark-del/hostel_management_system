import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Students, HostelRooms, RoomAllocations } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Settings, 
  UserPlus, 
  Home, 
  Trash2, 
  Edit,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {
  const [students, setStudents] = useState<Students[]>([]);
  const [rooms, setRooms] = useState<HostelRooms[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Student form state
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    studentId: '',
    dateOfBirth: '',
    gender: '',
    contactEmail: '',
    phoneNumber: '',
    course: '',
    yearOfStudy: '',
  });

  // Room form state
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    capacity: '',
    roomType: '',
    floorNumber: '',
    amenities: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [studentsData, roomsData] = await Promise.all([
        BaseCrudService.getAll<Students>('students'),
        BaseCrudService.getAll<HostelRooms>('rooms'),
      ]);

      setStudents(studentsData.items);
      setRooms(roomsData.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    
    if (!studentForm.fullName || !studentForm.studentId) {
      alert('Please fill in required fields (Name and Student ID)');
      return;
    }

    try {
      await BaseCrudService.create('students', {
        _id: crypto.randomUUID(),
        fullName: studentForm.fullName,
        studentId: studentForm.studentId,
        dateOfBirth: studentForm.dateOfBirth || undefined,
        gender: studentForm.gender || undefined,
        contactEmail: studentForm.contactEmail || undefined,
        phoneNumber: studentForm.phoneNumber || undefined,
        course: studentForm.course || undefined,
        yearOfStudy: studentForm.yearOfStudy ? parseInt(studentForm.yearOfStudy) : undefined,
      });

      setStudentForm({
        fullName: '',
        studentId: '',
        dateOfBirth: '',
        gender: '',
        contactEmail: '',
        phoneNumber: '',
        course: '',
        yearOfStudy: '',
      });
      setStudentDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to create student');
    }
  }

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    
    if (!roomForm.roomNumber || !roomForm.capacity) {
      alert('Please fill in required fields (Room Number and Capacity)');
      return;
    }

    try {
      await BaseCrudService.create('rooms', {
        _id: crypto.randomUUID(),
        roomNumber: roomForm.roomNumber,
        capacity: parseInt(roomForm.capacity),
        roomType: roomForm.roomType || undefined,
        floorNumber: roomForm.floorNumber ? parseInt(roomForm.floorNumber) : undefined,
        amenities: roomForm.amenities || undefined,
        isAvailable: true,
      });

      setRoomForm({
        roomNumber: '',
        capacity: '',
        roomType: '',
        floorNumber: '',
        amenities: '',
      });
      setRoomDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    }
  }

  async function handleDeleteStudent(studentId: string) {
    const confirmed = window.confirm('Are you sure you want to delete this student? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await BaseCrudService.delete('students', studentId);
      loadData();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  }

  async function handleDeleteRoom(roomId: string) {
    const confirmed = window.confirm('Are you sure you want to delete this room? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await BaseCrudService.delete('rooms', roomId);
      loadData();
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      <section className="w-full max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl text-secondary">
              Admin Panel
            </h1>
          </div>
          <p className="font-paragraph text-lg text-primary-foreground/80 max-w-3xl">
            Manage system data, add new students and rooms, and maintain hostel records.
          </p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="bg-primary border border-primary-foreground/20 mb-8">
            <TabsTrigger 
              value="students" 
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-paragraph"
            >
              Manage Students
            </TabsTrigger>
            <TabsTrigger 
              value="rooms" 
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-paragraph"
            >
              Manage Rooms
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-2xl text-secondary">
                Student Management
              </h2>
              
              <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-buttonbackground text-secondary-foreground hover:brightness-95 font-paragraph">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-primary border-primary-foreground/20 text-primary-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-secondary">
                      Add New Student
                    </DialogTitle>
                    <DialogDescription className="font-paragraph text-base text-primary-foreground/70">
                      Enter student information to add them to the system
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateStudent} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Full Name *
                        </Label>
                        <Input
                          value={studentForm.fullName}
                          onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})}
                          required
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Student ID *
                        </Label>
                        <Input
                          value={studentForm.studentId}
                          onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})}
                          required
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="STU001"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Date of Birth
                        </Label>
                        <Input
                          type="date"
                          value={studentForm.dateOfBirth}
                          onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Gender
                        </Label>
                        <select
                          value={studentForm.gender}
                          onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}
                          className="w-full px-4 py-2 bg-primary border border-primary-foreground/20 rounded-lg text-primary-foreground font-paragraph text-base focus:outline-none focus:border-secondary"
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Email
                        </Label>
                        <Input
                          type="email"
                          value={studentForm.contactEmail}
                          onChange={(e) => setStudentForm({...studentForm, contactEmail: e.target.value})}
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Phone Number
                        </Label>
                        <Input
                          type="tel"
                          value={studentForm.phoneNumber}
                          onChange={(e) => setStudentForm({...studentForm, phoneNumber: e.target.value})}
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="+1234567890"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Course
                        </Label>
                        <Input
                          value={studentForm.course}
                          onChange={(e) => setStudentForm({...studentForm, course: e.target.value})}
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="Computer Science"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Year of Study
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="6"
                          value={studentForm.yearOfStudy}
                          onChange={(e) => setStudentForm({...studentForm, yearOfStudy: e.target.value})}
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        type="button"
                        onClick={() => setStudentDialogOpen(false)}
                        className="bg-primary border border-primary-foreground/20 text-primary-foreground hover:border-secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-buttonbackground text-secondary-foreground hover:brightness-95"
                      >
                        Add Student
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-primary border border-primary-foreground/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-foreground/5 border-b border-primary-foreground/10">
                    <tr>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Name</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Student ID</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Email</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Course</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Year</th>
                      <th className="px-6 py-4 text-right font-heading text-base text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className="border-b border-primary-foreground/5 hover:bg-primary-foreground/5">
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground">
                          {student.fullName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground/80">
                          {student.studentId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground/80">
                          {student.contactEmail || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground/80">
                          {student.course || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground/80">
                          {student.yearOfStudy || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() => handleDeleteStudent(student._id)}
                            className="bg-destructive text-destructiveforeground hover:brightness-90"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {students.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-paragraph text-base text-primary-foreground/60">
                    No students found. Add your first student above.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-2xl text-secondary">
                Room Management
              </h2>
              
              <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-buttonbackground text-secondary-foreground hover:brightness-95 font-paragraph">
                    <Home className="w-4 h-4 mr-2" />
                    Add New Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-primary border-primary-foreground/20 text-primary-foreground max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-secondary">
                      Add New Room
                    </DialogTitle>
                    <DialogDescription className="font-paragraph text-base text-primary-foreground/70">
                      Enter room details to add it to the system
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateRoom} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Room Number *
                        </Label>
                        <Input
                          value={roomForm.roomNumber}
                          onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                          required
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="101"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Capacity *
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={roomForm.capacity}
                          onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                          required
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="2"
                        />
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Room Type
                        </Label>
                        <select
                          value={roomForm.roomType}
                          onChange={(e) => setRoomForm({...roomForm, roomType: e.target.value})}
                          className="w-full px-4 py-2 bg-primary border border-primary-foreground/20 rounded-lg text-primary-foreground font-paragraph text-base focus:outline-none focus:border-secondary"
                        >
                          <option value="">Select...</option>
                          <option value="Single">Single</option>
                          <option value="Double">Double</option>
                          <option value="Triple">Triple</option>
                          <option value="Quad">Quad</option>
                        </select>
                      </div>

                      <div>
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Floor Number
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={roomForm.floorNumber}
                          onChange={(e) => setRoomForm({...roomForm, floorNumber: e.target.value})}
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="font-paragraph text-base text-primary-foreground mb-2 block">
                          Amenities
                        </Label>
                        <Input
                          value={roomForm.amenities}
                          onChange={(e) => setRoomForm({...roomForm, amenities: e.target.value})}
                          className="bg-primary border-primary-foreground/20 text-primary-foreground"
                          placeholder="WiFi, AC, Attached Bathroom"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        type="button"
                        onClick={() => setRoomDialogOpen(false)}
                        className="bg-primary border border-primary-foreground/20 text-primary-foreground hover:border-secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-buttonbackground text-secondary-foreground hover:brightness-95"
                      >
                        Add Room
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-primary border border-primary-foreground/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-foreground/5 border-b border-primary-foreground/10">
                    <tr>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Room Number</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Type</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Capacity</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Floor</th>
                      <th className="px-6 py-4 text-left font-heading text-base text-secondary">Status</th>
                      <th className="px-6 py-4 text-right font-heading text-base text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room._id} className="border-b border-primary-foreground/5 hover:bg-primary-foreground/5">
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground">
                          {room.roomNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground/80">
                          {room.roomType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground/80">
                          {room.capacity || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-paragraph text-base text-primary-foreground/80">
                          {room.floorNumber !== undefined ? room.floorNumber : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-paragraph font-semibold ${
                            room.isAvailable 
                              ? 'bg-secondary/20 text-secondary' 
                              : 'bg-destructive/20 text-destructive'
                          }`}>
                            {room.isAvailable ? 'Available' : 'Occupied'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="bg-destructive text-destructiveforeground hover:brightness-90"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {rooms.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-paragraph text-base text-primary-foreground/60">
                    No rooms found. Add your first room above.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}
