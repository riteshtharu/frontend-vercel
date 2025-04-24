import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash, FaTimes, FaUser, FaUpload } from 'react-icons/fa';
import '../style/students.css';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/students');
        setStudents(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm) ||
    student.course.toLowerCase().includes(searchTerm)
  );

  const openModal = (mode, student = null) => {
    setModalMode(mode);
    setCurrentStudent(student || {
      name: '',
      photo: '',
      email: '',
      age: '',
      course: ''
    });
    setPreviewImage(student?.photo || null);
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStudent(null);
    setPreviewImage(null);
  };

  const handleAddStudent = () => openModal('add');
  const handleView = (student) => openModal('view', student);
  const handleEdit = (student) => openModal('edit', student);

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!studentToDelete) return;
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/api/students/${studentToDelete._id}`);
      setStudents(students.filter(student => student._id !== studentToDelete._id));
      setShowDeleteConfirm(false);
      setStudentToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({
      ...currentStudent,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewImage(resizedImage);
        setCurrentStudent({
          ...currentStudent,
          photo: resizedImage
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (modalMode === 'add') {
        const res = await axios.post('http://localhost:3000/api/students', currentStudent);
        setStudents([...students, res.data]);
      } else if (modalMode === 'edit') {
        const res = await axios.put(
          `http://localhost:3000/api/students/${currentStudent._id}`,
          currentStudent
        );
        setStudents(students.map(student =>
          student._id === currentStudent._id ? res.data : student
        ));
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="student-records">
      <h1>Explore Student Records</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="controls-container">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button onClick={handleAddStudent} className="add-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : '+ Add students'}
        </button>
      </div>

      {isLoading && !students.length ? (
        <div className="loading">Loading students...</div>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Photo</th>
              <th>Email</th>
              <th>Age</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>
                    {student.photo ? (
                      <img src={student.photo} alt={student.name} className="student-photo" />
                    ) : (
                      <div className="photo-placeholder">
                        <FaUser />
                      </div>
                    )}
                  </td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.course}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleView(student)} className="action-button view" title="View"><FaEye /></button>
                      <button onClick={() => handleEdit(student)} className="action-button edit" title="Edit"><FaEdit /></button>
                      <button onClick={() => confirmDelete(student)} className="action-button delete" title="Delete" disabled={isLoading}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-records">
                  No matching student records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {modalMode === 'view' ? 'Student Details' : 
                 modalMode === 'edit' ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button onClick={closeModal} className="close-button" disabled={isLoading}><FaTimes /></button>
            </div>

            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="student-details">
                  <div className="student-photo-container">
                    {currentStudent.photo ? (
                      <img src={currentStudent.photo} alt={currentStudent.name} className="modal-photo" />
                    ) : (
                      <div className="photo-placeholder large"><FaUser /></div>
                    )}
                  </div>
                  <div className="detail-row"><span className="detail-label">Name:</span><span>{currentStudent.name}</span></div>
                  <div className="detail-row"><span className="detail-label">Email:</span><span>{currentStudent.email}</span></div>
                  <div className="detail-row"><span className="detail-label">Age:</span><span>{currentStudent.age}</span></div>
                  <div className="detail-row"><span className="detail-label">Course:</span><span>{currentStudent.course}</span></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={currentStudent.name} onChange={handleInputChange} required disabled={isLoading} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={currentStudent.email} onChange={handleInputChange} required disabled={isLoading} />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={currentStudent.age} onChange={handleInputChange} min="16" max="99" required disabled={isLoading} />
                  </div>
                  <div className="form-group">
                    <label>Course</label>
                    <input type="text" name="course" value={currentStudent.course} onChange={handleInputChange} required disabled={isLoading} />
                  </div>
                  <div className="form-group">
                    <label>Photo</label>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} disabled={isLoading} />
                    <div className="image-upload-container">
                      {previewImage ? (
                        <div className="image-preview">
                          <img src={previewImage} alt="Preview" className="uploaded-image" />
                          <button type="button" onClick={triggerFileInput} className="change-image-button" disabled={isLoading}>Change Image</button>
                        </div>
                      ) : (
                        <div className="upload-placeholder" onClick={triggerFileInput} style={isLoading ? { pointerEvents: 'none', opacity: 0.6 } : {}}>
                          <FaUpload className="upload-icon" />
                          <span>Upload Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <div className="modal-actions">
                    <button type="button" onClick={closeModal} className="cancel-button" disabled={isLoading}>Cancel</button>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                      {isLoading ? 'Processing...' : modalMode === 'add' ? 'Add Student' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="close-button" disabled={isLoading}><FaTimes /></button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete <strong>{studentToDelete?.name}</strong>?</p>
              <div className="modal-actions">
                <button onClick={() => setShowDeleteConfirm(false)} className="cancel-button" disabled={isLoading}>Cancel</button>
                <button onClick={handleDeleteConfirmed} className="submit-button delete" disabled={isLoading}>
                  {isLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
