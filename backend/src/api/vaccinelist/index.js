const router = require('express').Router()
const { body, validationResult, param } = require('express-validator')
const db = require('../../client')
const { adminAuth, doctorAuth } = require('../../middlewares')


const nameRequired = body('name').notEmpty()
const monthsRequired = body('months').notEmpty().toInt()



const idExists = param('id').toInt().custom(async (value, {req})=>{
    try{
        const {id} = req.params;
    const vaccineList = await db.vaccineList.findFirst({
        where:{
            id: id
        }
    })
    if(!vaccineList) return Promise.reject("Record Doesn't Exist")
    return Promise.resolve()
    }catch(err){
        return Promise.reject(err.message||"Something went wrong")
    }
})

router.get('/',async (req,res,next)=>{
    try{
        const {name, months} = req.query;
        const vaccineList = await db.vaccineList.findMany({
           where:{
               name:{
                   contains: name!==null?name:undefined
               },
               months:{
                  gte: (months!==null && months !==undefined)?  Number(months) : undefined
               }
           },
           orderBy:{
            doctors:{
                _count: 'desc'
            }
           },
           include:{
               _count:{
                   select:{
                       doctors: true
                   }
               }
           }
        })

        res.json({data: vaccineList})
    }catch(err){
        next(err)
    }
})

router.post('/', adminAuth, nameRequired,monthsRequired,async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Validation Error", errors: errors.array() });
        }

        const {name, months, description} = req.body;
        const vaccineList = await db.vaccineList.create({
            data:{
                name: name,
                months: months,
                description: description
            }
        })

        res.json({message:"Record Added", data: vaccineList})
    }catch(err){
        next(err)
    }
})


router.get('/:id',async (req,res,next)=>{
    try{
       

        const {id} = req.params
        const vaccineList = await db.vaccineList.findFirst({
            where:{
                id: Number(id)
            }
            
        })

        res.json({data: vaccineList})
    }catch(err){
        next(err)
    }
})


router.put('/:id', adminAuth, idExists ,nameRequired,monthsRequired,async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Validation Error", errors: errors.array() });
        }

        const {id} = req.params
        const {name, months, description} = req.body;
        const vaccineList = await db.vaccineList.update({
            where:{
                id: id
            },
            data:{
                name: name,
                months: months,
                description: description
            }
        })

        res.json({message:"Record Updated", data: vaccineList})
    }catch(err){
        next(err)
    }
})

router.delete('/:id', adminAuth, idExists,async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Validation Error", errors: errors.array() });
        }

        const {id} = req.params
        const vaccineList = await db.vaccineList.delete({
            where:{
                id: id
            },
        })

        res.json({message:"Record Deleted", data: vaccineList})
    }catch(err){
        next(err)
    }
})


router.get('/:id/recommendations', async (req,res,next)=>{
    try {
        const {id} = req.params;
        const vaccineId = Number(id);
        const vaccine = await db.vaccineList.findFirst({
            where:{
                id: vaccineId
            },
            include:{
               doctors: true, 
            }
        })
        return res.json({data:vaccine.doctors})
    } catch (error) {
        next(error)
    }
})

router.get('/:id/recommended', doctorAuth,async (req,res,next)=>{
    try {
        const {id} = req.params;
        const vaccineId = Number(id);
        const vaccine = await db.vaccineList.findFirst({
            where:{
                id: vaccineId,
                doctors:{
                    some:{
                        id: Number(req.user.id)
                    }
                }
            },
            
        })
        return res.json({data:{
            hasRecommended: !!vaccine
        }})
    } catch (error) {
        next(error)
    }
})

router.post('/:id/recommendations', doctorAuth, async (req,res,next)=>{
    try {
        const {id} = req.params;
        const vaccineId = Number(id);
        const vaccine = await db.vaccineList.update({
            where:{
                id: vaccineId
            },
            data:{
                doctors:{
                    connect:{
                        id: Number(req.user.id)
                    }
                }
            }
        })
        return res.json({message: "Recommendation Added"})
    } catch (error) {
        next(error)
    }
})

router.delete('/:id/recommendations', doctorAuth, async (req,res,next)=>{
    try {
        const {id} = req.params;
        const vaccineId = Number(id);
        const vaccine = await db.vaccineList.update({
            where:{
                id: vaccineId
            },
            data:{
                doctors:{
                    disconnect:{
                        id: Number(req.user.id)
                    }
                }
            }
        })
        return res.json({message: "Recommendation Removed"})
    } catch (error) {
        next(error)
    }
})
module.exports = router
