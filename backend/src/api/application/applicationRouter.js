const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');



router.get('/', async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        
        const applications = await prisma.application.findMany({

            include: {
                vacancy: {
                    select: {
                        title: true,
                        schedule: true,
                        score: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone_number: true


                    }
                }
            },
            where: {
                status:'Pending',
                vacancy: {
                    hospitalId
                }
            }
        });

        res.status(200).json(applications);
    } catch (error) {
      

        res.status(404).json({ error: 'Erro ao encontrar pedidos' });
    }
});

router.delete('/:id', async (req, res) => {
    const hospitalId = req.user.hospitalId;
    try {
        const { id } = req.params
        const application = await prisma.application.findUnique({
            where: { id: +id },
            include: {
                vacancy: {
                    select: {
                        hospitalId: true
                    }
                }
            }
        });

        if (application.vacancy.hospitalId == hospitalId) {

            await prisma.application.delete({

                where: {
                    id: +id
                }
            })
            res.status(200).json({ message: 'Pedido recusado com sucesso.' });
        }
        else {
            res.status(401).json({ message: 'Não autorizado' })
        }


    } catch (error) {

        res.status(500).json({ error: 'Erro ao remover pedido' });
    }

})

router.put('/:id', async (req, res) => {
    const hospitalId = req.user.hospitalId;
    try {
        const { id } = req.params
        

        await prisma.application.update({
            data:{
                status: 'Approved'
            },
            where: {
                id: +id
            }
        })
        res.status(200).json({ message: 'Pedido atualizado com sucesso.' });

    } catch (error) {
  
      
        

        res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }

})
module.exports = router;