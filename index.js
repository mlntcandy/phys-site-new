import physEngine from 'phys-engine'
import 'dotenv/config'

const webserver = new physEngine.WebServer(3000, [
    physEngine.middleware.serveStatic('resources'),
])

const pagerenderer = new physEngine.PageRenderer('./views/')
const articleserver = new physEngine.ArticleServer('./articles/', 'a', pagerenderer, webserver)
const testengine = new physEngine.TestEngine(webserver, pagerenderer, {
    host: "smtp.yandex.ru",
    port: 465,
    isSecure: true,
    login: "fizika@mlntcandy.com",
    pass: process.env.EMAIL_PASSWORD,
    sender: "Сайт Физика",
})
articleserver.serveHomePage('home', webserver)
webserver.serveHttpError(e => articleserver.renderArticle(`errors/${e}`))
// webserver.onListen(() => {

// })
