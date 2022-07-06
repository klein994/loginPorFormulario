const apiControllers = {
    apiLogin: (req, res) => {
        const name = req.params.name;
        req.session.name = name;
        res.status(201).json({logged: true});
    },
    apiLogout: (req, res) => {
        req.session.destroy(
            (err) => {
                if(!err) {
                    res.status(200).json({logged: false});
                } else {
                    console.log(err);
                }
            }
        )
    },
    productosTest: (req, res) => {
        res.sendFile('indexTest.html', { root: './public/views' })
    },
    getName: (req, res) => {
        res.status(200).json({name: req.session.name});
    }
}

export default apiControllers;