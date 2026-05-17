export const CurrentUser=async(req,res)=>{
try {
    if(!req.user){
        return res.status(400).json({
            user:null
        })
    }
    return res.json(req.user)
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message:"Current User Error"
    })
}
}


