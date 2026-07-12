import authService from '../services/auth.service.js';

const registerAdmin = async (req, res) => {
    try{
        const admin = await authService.adminRegister(req.body);
        res.status(201).json({
            success:true,
             message: admin.mesage, 
             email: admin.email 
            });
    }catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error)
    }
}

const verifyEmail= async(req, res)=> {
    try{
        const {token}= req.query;
       const result = await authService.emailVerify(token);

       return res.status(200).json({ success: true, message: "Email verified successfully", pendingApproval: result?.pendingApproval || false });
    }catch(err){
     const status = err.status || 500;
     res.status(status).json({error: err.message});
     console.log(err);
    }
}

const loginAdmin = async (req, res) => {
    try{
        const {admin, token} = await authService.adminLogin(req.body.collegeEmail, req.body.password);
        res.cookie("token", token,{
            httpOnly:true,
        })
        res.status(200).json({ message: 'Admin logged in successfully', admin });
    }catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message, code: error.code || null });
        console.log(error);
    }
}

const logoutAdmin= async (req, res)=>{
    try{
       res.clearCookie("token", {
        httpOnly:true
       })

       res.json({message: "Logout successfully"})
    }catch(err){
        res.status(500).json({error:err.message});
        console.log(err);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req.body.email);
        res.status(200).json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
        console.log(error);
    }
}

const verifyResetCode = async (req, res) => {
    try {
        const result = await authService.verifyResetCode(req.body.email, req.body.code);
        res.status(200).json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
        console.log(error);
    }
}

const resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req.body.resetToken, req.body.newPassword);
        res.status(200).json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
        console.log(error);
    }
}

export default {
    registerAdmin,
    loginAdmin,
    verifyEmail,
    logoutAdmin,
    forgotPassword,
    verifyResetCode,
    resetPassword
};