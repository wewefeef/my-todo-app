import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TodoItem from '../../components/TodoItem';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  startDate: Date | null;
  endDate: Date | null;
  overdue: boolean;
  category: string | null;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [isWaitingForDates, setIsWaitingForDates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Work', icon: '📧', color: '#ff6f61' },
    { name: 'Sport', icon: '🏋️', color: '#a3e4d7' },
    { name: 'Movie', icon: '🎬', color: '#87ceeb' },
    { name: 'Health', icon: '❤️', color: '#b0e0e6' },
    { name: 'Study', icon: '🎓', color: '#d6a4ff' },
  ];

  const adjustToVietnamTime = (date: Date): Date => {
    // Convert the date to Vietnam timezone (UTC+7) by adjusting from UTC
    const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
    const vietnamOffset = 7 * 60 * 60 * 1000; // UTC+7 in milliseconds
    const vietnamDate = new Date(utcDate.getTime() + vietnamOffset);
    // Normalize to start of the day (00:00:00)
    return new Date(vietnamDate.getFullYear(), vietnamDate.getMonth(), vietnamDate.getDate());
  };

  const onPressAddOrSave = () => {
    if (!input.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên công việc');
      return;
    }

    if (editingId) {
      // For editing, always allow reselecting dates
      setIsWaitingForDates(true);
      setStartDatePickerVisible(true);
    } else {
      // For adding a new task
      setIsWaitingForDates(true);
      setStartDatePickerVisible(true);
    }
  };

  const handleConfirmStartDate = (date: Date) => {
    const adjustedDate = adjustToVietnamTime(date);
    setStartDate(adjustedDate);
    setStartDatePickerVisible(false);
    setEndDatePickerVisible(true);
  };

  const handleConfirmEndDate = (date: Date) => {
    const adjustedDate = adjustToVietnamTime(date);
    setEndDate(adjustedDate);
    setEndDatePickerVisible(false);
  };

  useEffect(() => {
    if (isWaitingForDates && startDate && endDate) {
      if (endDate < startDate) {
        Alert.alert('Lỗi', 'Ngày kết thúc không được trước ngày bắt đầu');
        resetForm();
        return;
      }

      if (editingId) {
        setTasks(prev =>
          prev.map(task =>
            task.id === editingId
              ? { ...task, text: input, startDate, endDate, category: selectedCategory }
              : task
          )
        );
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          text: input,
          completed: false,
          startDate,
          endDate,
          overdue: false,
          category: selectedCategory,
        };
        setTasks(prev => [...prev, newTask]);
      }

      resetForm();
    }
  }, [isWaitingForDates, startDate, endDate]);

  const resetForm = () => {
    setInput('');
    setStartDate(null);
    setEndDate(null);
    setEditingId(null);
    setIsWaitingForDates(false);
    setSelectedCategory(null);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setInput(task.text || '');
      setStartDate(task.startDate ? new Date(task.startDate) : null);
      setEndDate(task.endDate ? new Date(task.endDate) : null);
      setSelectedCategory(task.category);
      setEditingId(id);
      setIsWaitingForDates(false); // Reset to allow date picker flow
    }
  };

  useEffect(() => {
    const now = new Date();
    const vietnamNow = adjustToVietnamTime(now);
    setTasks(prev =>
      prev.map(task => {
        if (!task.completed && task.endDate && task.endDate < vietnamNow) {
          return { ...task, overdue: true, completed: true };
        }
        return { ...task, overdue: false };
      })
    );
  }, [tasks.length]);

  const tasksDoing = tasks.filter(t => !t.completed && !t.overdue);
  const tasksOverdue = tasks.filter(t => t.overdue);
  const tasksDone = tasks.filter(t => t.completed && !t.overdue);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 To Do List</Text>

      <View style={styles.inputContainer}>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryButton,
                { backgroundColor: category.color },
                selectedCategory === category.name && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nhập công việc..."
            value={input}
            onChangeText={setInput}
          />
          <Button
            title={editingId ? 'Lưu' : 'Thêm'}
            onPress={onPressAddOrSave}
            color="#007bff"
          />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        locale="vi-VN"
        onConfirm={handleConfirmStartDate}
        onCancel={() => {
          setStartDatePickerVisible(false);
          setIsWaitingForDates(false);
        }}
        date={startDate || new Date()} // Ensure the picker starts with the current start date
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        locale="vi-VN"
        onConfirm={handleConfirmEndDate}
        onCancel={() => {
          setEndDatePickerVisible(false);
          setIsWaitingForDates(false);
        }}
        date={endDate || new Date()} // Ensure the picker starts with the current end date
      />

      <Text style={styles.sectionTitle}>Đang làm</Text>
      {tasksDoing.length === 0 && <Text style={styles.emptyText}>Chưa có công việc nào</Text>}
      <FlatList
        data={tasksDoing}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onEdit={editTask}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Chưa hoàn thành (quá hạn)</Text>
      {tasksOverdue.length === 0 && <Text style={styles.emptyText}>Không có công việc trễ hạn</Text>}
      <FlatList
        data={tasksOverdue}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onEdit={editTask}
            showOverdueWarning
          />
        )}
      />

      <Text style={styles.sectionTitle}>Đã hoàn thành</Text>
      {tasksDone.length === 0 && <Text style={styles.emptyText}>Chưa có công việc nào</Text>}
      <FlatList
        data={tasksDone}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onEdit={editTask}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});