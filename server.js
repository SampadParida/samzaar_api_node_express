import {app} from './app/index.js'

const port = process.env.PORT || '3001'

app.listen(port, (err) => {
    if(err){
        console.log(`App listen error = ${err}`)
    } else {
        console.log(`SamZaar API app is listening on port ${port}`)
    }
})