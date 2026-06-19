import { useGameStore } from '@/store/gameStore';
import { Users, Plus, Minus, UserPlus, UserMinus, DollarSign, Star } from 'lucide-react';
import { useState } from 'react';

export default function StaffPanel() {
  const { staff, hireStaff, fireStaff, updateStaffSalary } = useGameStore();
  const [showHireForm, setShowHireForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffSalary, setNewStaffSalary] = useState(3500);

  const handleHire = () => {
    if (newStaffName.trim()) {
      hireStaff(newStaffName.trim(), newStaffSalary);
      setNewStaffName('');
      setNewStaffSalary(3500);
      setShowHireForm(false);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <Users className="w-5 h-5 text-primary" />
        员工管理
      </h2>

      <div className="space-y-3">
        {staff.map((member) => (
          <div key={member.id} className="bg-orange-50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-secondary">{member.name}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent-yellow" />
                    技能 {member.skill}
                  </span>
                  <span className={`${member.satisfaction >= 60 ? 'text-accent-green' : member.satisfaction >= 30 ? 'text-accent-yellow' : 'text-accent-red'}`}>
                    满意度 {member.satisfaction}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateStaffSalary(member.id, member.salary - 200)}
                  className="w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm hover:bg-gray-50"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-semibold text-secondary w-16 text-center">
                  ¥{member.salary}
                </span>
                <button
                  onClick={() => updateStaffSalary(member.id, member.salary + 200)}
                  className="w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => fireStaff(member.id)}
                className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center hover:bg-red-200 transition-colors"
                title="解雇"
              >
                <UserMinus className="w-4 h-4 text-accent-red" />
              </button>
            </div>
          </div>
        ))}

        {staff.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            暂无员工，请招聘新员工
          </div>
        )}

        {showHireForm ? (
          <div className="bg-orange-50 rounded-lg p-4 space-y-3">
            <input
              type="text"
              placeholder="员工姓名"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className="input-field"
            />
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <input
                type="number"
                value={newStaffSalary}
                onChange={(e) => setNewStaffSalary(parseInt(e.target.value))}
                className="input-field flex-1"
                min={2500}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleHire} className="flex-1 btn-primary text-sm py-2">
                确认招聘
              </button>
              <button
                onClick={() => setShowHireForm(false)}
                className="flex-1 btn-outline text-sm py-2"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowHireForm(true)}
            className="w-full py-3 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            招聘新员工
          </button>
        )}
      </div>
    </div>
  );
}
