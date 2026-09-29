const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const {userDashboardInfo, userApply, jobsStatus, getProfile, updateProfile, addSkill, removeSkill, uploadResume} = require('../controllers/userController')

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if(mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only PDF, DOC, DOCX files are allowed'))
    }
  }
})

router.get('/', userDashboardInfo)
router.post('/apply/:id', userApply)
router.get('/jobs', jobsStatus)
router.get('/profile', getProfile)
router.post('/update-profile', updateProfile)
router.post('/add-skill', addSkill)
router.post('/remove-skill', removeSkill)
router.post('/upload-resume', upload.single('resume'), uploadResume)

module.exports = router