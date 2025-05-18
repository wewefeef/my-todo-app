import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  item: {
    id: string;
    text: string;
    completed: boolean;
    overdue: boolean;
    startDate: Date | null;
    endDate: Date | null;
    category: string | null;
  };
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  showOverdueWarning?: boolean;
};

export default function TodoItem({ item, onDelete, onToggle, onEdit, showOverdueWarning }: Props) {
  const categoryColors: { [key: string]: string } = {
    Work: '#ff6f61',
    Sport: '#a3e4d7',
    Movie: '#87ceeb',
    Health: '#b0e0e6',
    Study: '#d6a4ff',
  };

  const categoryColor = item.category ? categoryColors[item.category] || '#e0e0e0' : '#e0e0e0';

  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={[styles.circle, item.completed && styles.checkedCircle]}
        onPress={() => onToggle(item.id)}
      >
        {item.completed && <View style={styles.stick} />}
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <View style={styles.taskRow}>
          <Text style={[styles.text, item.completed && styles.completedText]}>
            {item.text}
          </Text>
          {item.category && (
            <View style={[styles.categoryTag, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>
        {item.startDate && (
          <Text style={styles.dateText}>
            Bắt đầu: {item.startDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
          </Text>
        )}
        {item.endDate && (
          <Text style={styles.dateText}>
            Kết thúc: {item.endDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
          </Text>
        )}
        {showOverdueWarning && (
          <Text style={styles.overdueText}>⚠ Công việc quá hạn</Text>
        )}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item.id)}>
        <Text style={styles.editText}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#777',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    borderColor: '#28a745',
    backgroundColor: '#d4edda',
  },
  stick: {
    width: 12,
    height: 4,
    backgroundColor: '#28a745',
    borderRadius: 2,
  },
  textContainer: {
    flex: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  overdueText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 2,
    fontWeight: '600',
  },
  categoryTag: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
  },
});