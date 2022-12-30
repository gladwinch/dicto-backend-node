const fs = require("fs")
const path = require("path")
const validationMiddleware = require('../middleware/validation')

const fileNames = () => {
    const files = fs.readdirSync(path.join(__dirname, "..", "modules"))

    return files.map((file) => {
        return file.split(".")[0]
    })
}

exports.include = (router) => {
    const files = fileNames()

    for (let x of files) {
		let routerPath = `../modules/${x}/${x}.controller.js`
        let fsRouterPath = path.join(__dirname, '..', 'modules', x, `${x}.controller.js`)
        let fsValidationPath = path.join(__dirname, '..', 'modules', x, `${x}.validation.js`)

		if(fs.existsSync(fsRouterPath)) {
            router.use(
                `/${x}`,
                validationMiddleware(fsValidationPath), 
                require(routerPath)
            )
        }
    }

    return router
}