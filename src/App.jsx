import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Settings, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Clock, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Moon,
  Sun
} from 'lucide-react';

// --- Utility Functions ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultBusinessHours = daysOfWeek.map(day => ({
  day,
  isOpen: day !== 'Sunday',
  open: '09:00',
  close: '17:00'
}));

const initialStaff = [
  { id: '1', name: 'Sarah Jenkins', position: 'Manager', maxHours: 40, color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Mike Ross', position: 'Barista', maxHours: 30, color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Jessica Pearson', position: 'Server', maxHours: 25, color: 'bg-purple-100 text-purple-800' },
];

const formatTime = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const getWeekDates = (weekStr) => {
  const date = new Date(weekStr + 'T00:00:00');
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return daysOfWeek.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const formatShortDate = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// --- Components ---

const Card = ({ children, className = "", isDarkMode }) => (
  <div className={`rounded-xl shadow-sm border transition-colors duration-200 ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-100'
    } ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", icon: Icon, isDarkMode, type }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20",
    secondary: isDarkMode 
      ? "bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600"
      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    danger: isDarkMode 
      ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
      : "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: isDarkMode
      ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Input = ({ label, isDarkMode, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>}
    <input 
      className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500' 
          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
      }`}
      {...props} 
    />
  </div>
);

// --- Settings View ---

const SettingsView = ({ isDarkMode, scheduleName, setScheduleName, businessHours, setBusinessHours, textPrimary, textSecondary }) => (
  <div className="max-w-4xl mx-auto space-y-6">
    <Card isDarkMode={isDarkMode} className="p-6">
      <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${textPrimary}`}>
        <Calendar className="text-indigo-500" size={20} />
        Schedule Name
      </h3>
      <input
        type="text"
        value={scheduleName}
        onChange={(e) => setScheduleName(e.target.value)}
        placeholder="Enter schedule name..."
        className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-900/50 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
      />
    </Card>
    <Card isDarkMode={isDarkMode} className="p-6">
      <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${textPrimary}`}>
        <Clock className="text-indigo-500" size={20} />
        Business Operating Hours
      </h3>
      <div className="grid gap-4">
        {businessHours.map((bh, idx) => (
          <div key={bh.day} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center gap-3 w-32">
              <input
                type="checkbox"
                checked={bh.isOpen}
                onChange={(e) => {
                  const newHours = [...businessHours];
                  newHours[idx] = { ...newHours[idx], isOpen: e.target.checked };
                  setBusinessHours(newHours);
                }}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 bg-gray-700 border-gray-600"
              />
              <span className={`font-medium ${bh.isOpen ? textPrimary : textSecondary}`}>{bh.day}</span>
            </div>
            {bh.isOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={bh.open}
                  onChange={(e) => {
                    const newHours = [...businessHours];
                    newHours[idx] = { ...newHours[idx], open: e.target.value };
                    setBusinessHours(newHours);
                  }}
                  className={`p-2 border rounded text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                />
                <span className={textSecondary}>-</span>
                <input
                  type="time"
                  value={bh.close}
                  onChange={(e) => {
                    const newHours = [...businessHours];
                    newHours[idx] = { ...newHours[idx], close: e.target.value };
                    setBusinessHours(newHours);
                  }}
                  className={`p-2 border rounded text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                />
              </div>
            ) : (
              <span className={`${textSecondary} italic text-sm pr-12`}>Closed</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [staff, setStaff] = useState(initialStaff);
  const [shifts, setShifts] = useState([]);
  const [businessHours, setBusinessHours] = useState(defaultBusinessHours);
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scheduleName, setScheduleName] = useState('');
  const [staffSort, setStaffSort] = useState({ key: null, dir: 'asc' });
  
  // Modal State
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null); 
  const [tempShiftData, setTempShiftData] = useState({ startTime: '09:00', endTime: '17:00' });

  // Load from local storage
  useEffect(() => {
    const savedData = localStorage.getItem('swiftScheduleData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStaff(parsed.staff || initialStaff);
      setShifts(parsed.shifts || []);
      setBusinessHours(parsed.businessHours || defaultBusinessHours);
      if (parsed.isDarkMode !== undefined) setIsDarkMode(parsed.isDarkMode);
      if (parsed.scheduleName !== undefined) setScheduleName(parsed.scheduleName);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('swiftScheduleData', JSON.stringify({ staff, shifts, businessHours, isDarkMode, scheduleName }));
  }, [staff, shifts, businessHours, isDarkMode, scheduleName]);

  // --- Logic Helpers ---

  const addStaff = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStaff = {
      id: generateId(),
      name: formData.get('name'),
      position: formData.get('position'),
      maxHours: parseFloat(formData.get('maxHours')),
    };
    setStaff([...staff, newStaff]);
    e.target.reset();
  };

  const removeStaff = (id) => {
    setStaff(staff.filter(s => s.id !== id));
    setShifts(shifts.filter(s => s.employeeId !== id));
  };

  const handleOpenShiftModal = (employeeId, day, existingShift = null) => {
    setEditingShift({ employeeId, day, id: existingShift?.id });
    setTempShiftData({
      startTime: existingShift?.startTime || '09:00',
      endTime: existingShift?.endTime || '17:00'
    });
    setIsShiftModalOpen(true);
  };

  const saveShift = () => {
    if (!editingShift) return;
    const newShift = {
      id: editingShift.id || generateId(),
      employeeId: editingShift.employeeId,
      day: editingShift.day,
      week: selectedWeek,
      startTime: tempShiftData.startTime,
      endTime: tempShiftData.endTime
    };
    const otherShifts = shifts.filter(s => s.id !== newShift.id);
    setShifts([...otherShifts, newShift]);
    setIsShiftModalOpen(false);
    setEditingShift(null);
  };

  const deleteShift = (id) => {
    setShifts(shifts.filter(s => s.id !== id));
    setIsShiftModalOpen(false);
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let hours = (endH + endM / 60) - (startH + startM / 60);
    return hours > 0 ? hours : 0;
  };

  const getWeeklyHours = (employeeId) => {
    return shifts
      .filter(s => s.employeeId === employeeId && s.week === selectedWeek)
      .reduce((acc, s) => acc + calculateHours(s.startTime, s.endTime), 0);
  };

  const exportSchedule = () => {
    const headers = ['Employee', 'Position', ...daysOfWeek, 'Total Hours'];
    const rows = staff.map(emp => {
      const empShifts = shifts.filter(s => s.employeeId === emp.id && s.week === selectedWeek);
      const daysData = daysOfWeek.map(day => {
        const shift = empShifts.find(s => s.day === day);
        return shift ? `${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}` : 'OFF';
      });
      return [emp.name, emp.position, ...daysData, getWeeklyHours(emp.id).toFixed(1)];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `schedule_week_${selectedWeek}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Styles Helper ---
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const bgCard = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderNormal = isDarkMode ? 'border-gray-700' : 'border-gray-100';

  // --- Sub-Views ---

  const StaffView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card isDarkMode={isDarkMode} className="p-6 md:col-span-1 h-fit">
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
            <Plus className="text-indigo-500" size={20} />
            Add New Staff
          </h3>
          <form onSubmit={addStaff} className="space-y-4">
            <Input isDarkMode={isDarkMode} name="name" label="Full Name" placeholder="e.g. John Doe" required />
            <Input isDarkMode={isDarkMode} name="position" label="Position" placeholder="e.g. Cashier" required />
            <Input isDarkMode={isDarkMode} name="maxHours" label="Preferred Max Hours" type="number" placeholder="40" required />
            <Button isDarkMode={isDarkMode} type="submit" className="w-full">Add Employee</Button>
          </form>
        </Card>

        <Card isDarkMode={isDarkMode} className="p-6 md:col-span-2">
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
            <Users className="text-indigo-500" size={20} />
            Current Staff ({staff.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${borderNormal} ${textSecondary} text-sm`}>
                  {['name', 'position'].map(key => {
                    const isActive = staffSort.key === key;
                    return (
                      <th
                        key={key}
                        className="py-3 font-semibold cursor-pointer select-none group/th"
                        onClick={() => setStaffSort(prev =>
                          prev.key === key
                            ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
                            : { key, dir: 'asc' }
                        )}
                      >
                        <span className={`inline-flex items-center gap-1 hover:text-indigo-500 transition-colors ${isActive ? 'text-indigo-500' : ''}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          <span className="text-[10px]">
                            {isActive ? (staffSort.dir === 'asc' ? '▲' : '▼') : <span className="opacity-30">▲</span>}
                          </span>
                        </span>
                      </th>
                    );
                  })}
                  <th className="py-3 font-semibold">Max Hours</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...staff].sort((a, b) => {
                  if (!staffSort.key) return 0;
                  const valA = a[staffSort.key].toLowerCase();
                  const valB = b[staffSort.key].toLowerCase();
                  return staffSort.dir === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
                }).map(emp => (
                  <tr key={emp.id} className={`border-b ${borderNormal} group ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <td className={`py-3 font-medium ${textPrimary}`}>{emp.name}</td>
                    <td className={`py-3 ${textSecondary}`}>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {emp.position}
                      </span>
                    </td>
                    <td className={`py-3 ${textSecondary}`}>{emp.maxHours}h / week</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => removeStaff(emp.id)}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan="4" className={`py-8 text-center italic ${textSecondary}`}>No staff members added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );

  const ScheduleView = () => (
    <div className="space-y-4">
      {/* Schedule Header Controls */}
      <div className={`flex flex-col md:flex-row justify-between items-center p-4 rounded-xl shadow-sm border gap-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-4">
           <div className="flex flex-col">
             <label className={`text-xs font-semibold uppercase ${textSecondary}`}>Week Of</label>
             <input 
                type="date" 
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className={`font-medium focus:outline-none cursor-pointer hover:text-indigo-500 bg-transparent ${textPrimary}`}
                style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
             />
           </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-4 mr-6 text-sm">
             <div className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-indigo-900 border border-indigo-700' : 'bg-indigo-100 border border-indigo-200'}`}></div>
               <span className={textSecondary}>Shift Assigned</span>
             </div>
             <div className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-red-900/50 border border-red-800' : 'bg-red-50 border border-red-200'}`}></div>
               <span className={textSecondary}>Over Capacity</span>
             </div>
          </div>
          <Button isDarkMode={isDarkMode} variant="secondary" icon={Download} onClick={exportSchedule}>Export CSV</Button>
        </div>
      </div>

      {/* The Grid */}
      <div className={`rounded-xl shadow-sm border overflow-x-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr>
              <th className={`p-4 text-left border-b border-r w-64 min-w-[200px] sticky left-0 z-10 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>Employee</th>
              {daysOfWeek.map((day, i) => {
                const isClosed = !businessHours.find(b => b.day === day)?.isOpen;
                const weekDates = getWeekDates(selectedWeek);
                const dateLabel = formatShortDate(weekDates[i]);
                return (
                  <th key={day} className={`p-3 text-center border-b ${borderNormal} min-w-[120px] 
                    ${isClosed 
                      ? (isDarkMode ? 'bg-gray-900/70 text-gray-600' : 'bg-gray-100 text-gray-400') 
                      : (isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700')}`}>
                    <div className="text-sm font-semibold">{day}</div>
                    <div className="text-xs font-normal mt-0.5 opacity-80">{dateLabel}</div>
                    <div className="text-[10px] font-normal mt-0.5 opacity-50">
                       {isClosed ? 'Closed' : 'Open'}
                    </div>
                  </th>
                );
              })}
              <th className={`p-3 text-center border-b border-l w-24 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>Hrs</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(emp => {
              const weeklyHours = getWeeklyHours(emp.id);
              const isOverworked = weeklyHours > emp.maxHours;
              
              return (
                <tr key={emp.id} className="group">
                  <td className={`p-4 border-b border-r sticky left-0 z-10 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 group-hover:bg-gray-700' : 'bg-white border-gray-100 group-hover:bg-gray-50'}`}>
                    <div className={`font-bold ${textPrimary}`}>{emp.name}</div>
                    <div className={`text-xs ${textSecondary}`}>{emp.position}</div>
                  </td>
                  
                  {daysOfWeek.map(day => {
                    const shift = shifts.find(s => s.employeeId === emp.id && s.day === day && s.week === selectedWeek);
                    const isClosed = !businessHours.find(b => b.day === day)?.isOpen;

                    return (
                      <td key={day} className={`p-1 border-b relative ${borderNormal} ${isClosed ? (isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50/50') : ''}`}>
                        {isClosed ? (
                           <div className="h-16 flex items-center justify-center">
                             <span className={`text-xs select-none ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>/ / /</span>
                           </div>
                        ) : (
                          <button
                            onClick={() => handleOpenShiftModal(emp.id, day, shift)}
                            className={`w-full h-16 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1
                              ${shift 
                                ? (isDarkMode 
                                    ? 'bg-indigo-900/40 border-indigo-700 text-indigo-300 hover:bg-indigo-900/60 hover:border-indigo-600' 
                                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300')
                                : (isDarkMode 
                                    ? 'bg-transparent border-transparent hover:border-gray-700 hover:bg-gray-800 text-gray-600 hover:text-gray-400' 
                                    : 'bg-transparent border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600')
                              }
                            `}
                          >
                            {shift ? (
                              <>
                                <span className="text-xs font-bold">{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                                <span className="text-[10px] opacity-75">{calculateHours(shift.startTime, shift.endTime).toFixed(1)}h</span>
                              </>
                            ) : (
                              <Plus size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className={`p-3 text-center border-b border-l font-mono font-medium ${borderNormal}
                    ${isOverworked 
                      ? (isDarkMode ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50') 
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}
                  `}>
                    {weeklyHours.toFixed(1)}
                    {isOverworked && <AlertCircle size={12} className="inline ml-1 mb-1" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${bgMain} ${textPrimary}`}>
      {/* Navigation Bar */}
      <nav className={`border-b sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Calendar size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                SwiftSchedule
              </span>
            </div>
            <div className="flex items-center justify-center flex-1 mx-6">
              <span className={`text-center font-semibold truncate ${scheduleName ? textPrimary : textSecondary}`}>
                {scheduleName || 'Schedule name...'}
              </span>
            </div>
            <div className="flex space-x-1 items-center">
              {['schedule', 'staff', 'settings'].map(tab => (
                 <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                   activeTab === tab 
                     ? (isDarkMode ? 'bg-gray-700 text-indigo-400' : 'bg-indigo-50 text-indigo-700') 
                     : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50')
                 }`}
               >
                 {tab}
               </button>
              ))}
              <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                 <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                 >
                   {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'staff' && <StaffView />}
        {activeTab === 'settings' && <SettingsView isDarkMode={isDarkMode} scheduleName={scheduleName} setScheduleName={setScheduleName} businessHours={businessHours} setBusinessHours={setBusinessHours} textPrimary={textPrimary} textSecondary={textSecondary} />}
      </main>

      {/* Shift Edit Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl w-full max-w-sm overflow-hidden ${bgCard}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
              <h3 className={`font-bold ${textPrimary}`}>
                {editingShift.id ? 'Edit Shift' : 'Add Shift'}
              </h3>
              <button onClick={() => setIsShiftModalOpen(false)} className={`${textSecondary} hover:${textPrimary} text-xl leading-none`}>
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className={`text-sm mb-2 ${textSecondary}`}>
                {staff.find(s => s.id === editingShift.employeeId)?.name} &bull; {editingShift.day}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  isDarkMode={isDarkMode}
                  label="Start Time" 
                  type="time" 
                  value={tempShiftData.startTime}
                  onChange={(e) => setTempShiftData({...tempShiftData, startTime: e.target.value})}
                />
                <Input 
                  isDarkMode={isDarkMode}
                  label="End Time" 
                  type="time" 
                  value={tempShiftData.endTime}
                  onChange={(e) => setTempShiftData({...tempShiftData, endTime: e.target.value})}
                />
              </div>

              <div className={`p-3 rounded-lg text-sm flex justify-between items-center ${isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-800'}`}>
                <span>Total Duration:</span>
                <span className="font-bold">{calculateHours(tempShiftData.startTime, tempShiftData.endTime).toFixed(2)} hrs</span>
              </div>
            </div>

            <div className={`p-4 border-t flex justify-between gap-3 ${borderNormal}`}>
              {editingShift.id && (
                <Button isDarkMode={isDarkMode} variant="danger" onClick={() => deleteShift(editingShift.id)}>
                  Delete
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button isDarkMode={isDarkMode} variant="ghost" onClick={() => setIsShiftModalOpen(false)}>Cancel</Button>
                <Button isDarkMode={isDarkMode} onClick={saveShift}>{editingShift.id ? 'Update' : 'Assign'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
