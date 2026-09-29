const User = require('../models/userSchema')
const Job = require('../models/jobSchema')
const nodemailer = require('nodemailer')
const Application = require('../models/applicationSchema')

const adminDashboardInfo = async(req, res) => {
  try {
    const jobDetails = await Job.find()||[]
    const userCount = await User.countDocuments({role:"student"})
   
    const stats = await Application.aggregate([
      {$unwind:'$appliedJobs'},
      {
        $group:{
          _id:null,
          totalApplications:{$sum:1},
          totalPendingApplications:{
            $sum:{
              $cond:[
                {$eq:['$appliedJobs.applicationStatus','pending']},
                1,
                0
              ]
            }
          },
          totalRejectedApplications:{
            $sum:{
              $cond:[
                {$eq:['$appliedJobs.applicationStatus','rejected']},
                1,
                0
              ]
            }
          },
          totalApprovedApplications:{
            $sum:{
              $cond:[
                {$eq:['$appliedJobs.applicationStatus','approved']},
                1,
                0
              ]
            }
          }, 
        }
      }])
      const statData = stats[0] || {
        totalApplications: 0,
        totalPendingApplications: 0,
        totalApprovedApplications: 0,
        totalRejectedApplications: 0
      };
    const adminDashboardData = {
      totalStudents: userCount,
      totalJobs: jobDetails.length,
      totalApplications: statData.totalApplications,
      totalPendingApplications: statData.totalPendingApplications,
      totalApprovedApplications: statData.totalApprovedApplications,
      totalRejectedApplications: statData.totalRejectedApplications,
      jobListing: jobDetails,
    };
    res.render("admin/dashboard", { dashboard: adminDashboardData });
  } catch(err) {
    console.log("something went wrong",err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const getAddJob = (req, res) => {
  res.render("admin/addJob");
};

const addJob = async(req, res) => {
  try {
    const jobDetails = req.body;
    const existingCompany = await Job.findOne({companyName:jobDetails.company,jobTitle:jobDetails.title}) 
    if (existingCompany) {
      return res.json({
        success: false,
        message: "Company already exists with same Job title",
      });
    }
    const newJob = {
      jobTitle: jobDetails.title,
      companyName: jobDetails.company,
      location: jobDetails.location,
      package: jobDetails.package,
      eligibilityCriteria: jobDetails.eligibility,
      lastDateToApply: jobDetails.lastDate,
    };
    await Job.create(newJob);
    return res.json({ success: true, message: "Job added " });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const editJob = async(req,res) =>{
  try{
    const jobId = req.params.jobId.toString()
    const updatedJobDetails = req.body
    const updatedItem = await Job.findByIdAndUpdate(
      jobId,
      { $set: updatedJobDetails },
      { returnDocument:"after" } 
    );
    if(!updatedItem){
      return res.status(404).json({success:false, message: "Job not found"})
    }
    res.json({ success: true, message: "Job upadted" });
  }
  catch(err){
    console.log(err)
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}

const deleteJob = async(req, res) => {
  try {
    const jobId = req.params.jobId.toString()
    const deletedItem = await Job.findByIdAndDelete(jobId)
    if(!deletedItem){
      return res.status(404).json({success: false, message: "Job not found"})
    }
    await Application.updateMany({},{$pull:{appliedJobs:{jobId:jobId}}})
    await Application.deleteMany({appliedJobs:{$size:0}})
    return res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const showApplications = async(req,res)=>{
  try{
      const applicationsData = await Application.find().populate("userId").populate("appliedJobs.jobId")
      res.render('admin/applications',{applications:applicationsData})
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}
const approveApplication = async(req,res)=>{
  try{
    const {userId,jobId} = req.params;
    console.log(req.user)
    console.log(userId)
    await Application.updateOne(
      {
         userId,
         "appliedJobs.jobId": jobId
      },
      {
         $set:{
            "appliedJobs.$.applicationStatus":"approved"
         }
      }
      )
      return res.json({ success: true, message: "Application approved" });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}
const rejectApplication = async(req,res)=>{
  try{
    const {userId,jobId} = req.params;
    await Application.updateOne(
      {
         userId,
         "appliedJobs.jobId": jobId
      },
      {
         $set:{
            "appliedJobs.$.applicationStatus":"rejected"
         }
      }
      )
      return res.json({ success: true, message: "Application rejected" });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}
module.exports = { adminDashboardInfo, getAddJob, addJob, deleteJob,editJob,showApplications,approveApplication,rejectApplication };
