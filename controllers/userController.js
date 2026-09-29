const Job = require('../models/jobSchema')
const Application = require('../models/applicationSchema')
const User = require('../models/userSchema')

//Userdashboard info
const userDashboardInfo = async(req, res) => {
  try {
    const jobDetails = await Job.find();
    const userId = req.user.id
    const currentUserApplication = await Application.findOne({userId})
    const appliedJobs = currentUserApplication?.appliedJobs || []
    const appliedJobsId = new Set(appliedJobs.map(e=>e.jobId.toString()))
    const userApprovedApplications = appliedJobs.filter(
      (application) =>application.applicationStatus === "approved"
    );
    
    const user = await User.findById(userId)
    const userDashboardData = {
      totalJobs: jobDetails.length,
      appliedApplications: appliedJobs.length,
      approvedApplications: userApprovedApplications.length,
      jobListing: jobDetails,
      appliedJobsId,
    };
    
    res.render("user/dashboard", { dashboard: userDashboardData, user });
  } catch (err){

    console.log("something went wrong",err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

//Apply jobs 
const userApply = async (req, res) => {
  try {
    const applyJobId = req.params.id
    const userId = req.user.id

    const application = await Application.findOne({ userId })

    if (!application) {
      await Application.create({
        userId,
        appliedJobs: [
          {
            jobId: applyJobId,
            appliedDate: new Date(),
            applicationStatus: "pending"
          }
        ]
      })
      return res.redirect("/student")
    }

    const alreadyApplied = application.appliedJobs.find(
      job => job.jobId.toString() === applyJobId
    )

    if (alreadyApplied) {
      return res.json({
        success: false,
        message: "You already applied for this job"
      })
    }

    application.appliedJobs.push({
      jobId: applyJobId,
      appliedDate: new Date(),
      applicationStatus: "pending"
    })

    await application.save()

    res.redirect("/student")

  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "something went wrong"
    })
  }
}

//jobStaus info
const jobsStatus = async(req,res)=>{
  const userId = req.user.id
  const currentUserApplication = await Application.findOne({userId}).populate('appliedJobs.jobId')
  const jobsApplied = currentUserApplication?.appliedJobs || []
  res.render('user/jobs',{applications:jobsApplied})
}

const getProfile = async(req,res)=>{
  try {
    const userId = req.user.id
    const user = await User.findById(userId)
    if(!user) {
      return res.status(404).json({success: false, message: "User not found"})
    }
    return res.render('user/profile', {user})
  } catch (err) {
    console.log('Error getting profile:', err)
    return res.status(500).json({success: false, message: "something went wrong"})
  }
}

//Update user profile name
const updateProfile = async(req,res) => {
  try {
    const userId = req.user.id
    const {name, email} = req.body
    
    const updateData = {}
    if(name) updateData.username = name
    if(email) updateData.email = email
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {new: true})
    
    return res.json({success: true, message: "Profile updated successfully", user: updatedUser})
  } catch (err) {
    console.log('Error updating profile:', err)
    return res.status(500).json({success: false, message: "Error updating profile"})
  }
}

//Add skill
const addSkill = async(req,res) => {
  try {
    const userId = req.user.id
    const {skill} = req.body
    
    if(!skill || skill.trim() === '') {
      return res.json({success: false, message: "Skill cannot be empty"})
    }
    
    const user = await User.findById(userId)
    if(!user.skills) {
      user.skills = []
    }
    
    if(user.skills.includes(skill)) {
      return res.json({success: false, message: "Skill already exists"})
    }
    
    user.skills.push(skill)
    await user.save()
    
    return res.redirect('/student/profile')
  } catch (err) {
    console.log('Error adding skill:', err)
    return res.status(500).json({success: false, message: "Error adding skill"})
  }
}

//Remove skill
const removeSkill = async(req,res) => {
  try {
    const userId = req.user.id
    const {skill} = req.body
    
    const user = await User.findById(userId)
    user.skills = user.skills.filter(s => s !== skill)
    await user.save()
    
    return res.json({success: true, message: "Skill removed"})
  } catch (err) {
    console.log('Error removing skill:', err)
    return res.status(500).json({success: false, message: "Error removing skill"})
  }
}

//Upload resume
const uploadResume = async(req,res) => {
  try {
    const userId = req.user.id
    
    if(!req.file) {
      return res.json({success: false, message: "No file uploaded"})
    }
    
    const user = await User.findById(userId)
    user.resume = req.file.filename
    await user.save()
    
    return res.redirect('/student/profile')
  } catch (err) {
    console.log('Error uploading resume:', err)
    return res.status(500).json({success: false, message: "Error uploading resume"})
  }
}

module.exports = { userDashboardInfo, userApply, jobsStatus, getProfile, updateProfile, addSkill, removeSkill, uploadResume };
