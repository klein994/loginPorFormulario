const auth = (req, res, next) => {
    if(req.session.name) {
        return next()
    } else {
        res.redirect('/login')
    }
}

export { auth };