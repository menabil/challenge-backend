const router = require('express').Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');

router.post('/', protect, upload.single('medicalReportImage'), createAppointment);
router.patch('/:id/status', protect, updateAppointmentStatus);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
