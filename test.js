

// var db = new Promise(function(resolve, reject){
// 	ssh.on('ready', function(e, r) {
//         ssh.forwardOut(
//             // source address, this can usually be any valid address
//             '212.24.109.198',
//             // source port, this can be any valid port number
//             3306,
//             // destination address (localhost here refers to the SSH server)
//             '127.0.0.1',
//             // destination port
//             80,
//             function (err, stream) {
                
//               if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
//               // use `sql` connection as usual
//                   connection = mysql.createConnection({
//                   host     : '127.0.0.1',
//                   user     : 'root',
//                   password : '9Djf4n52R96Y', 
//                   database : 'piikki',
//                   stream: stream
//                 });
    
//             // send connection back in variable depending on success or not
//             connection.connect(function(err, r){
//                 console.log({err, r})
//                 // resolve(connection);
//                 // if (err) {
//                 //     resolve(connection);
//                 // } else {
//                 //     reject(err);
//                 // }
//             });
//           });
// 	}).connect({
// 	  host: '212.24.109.198',
// 	  port: 22,
// 	  username: 'patrik',
// 	  password: 'Datatoimari1'
// 	});
// });


// db
// .then((con) => {
//     // con.query('SELECT * FROM users', (err, res, f) => {
//     //     console.log({err, res, f});
//     // })
// });
async function test(){
    try {
        const res = await axios.get('https://indecs.fi/viikkis/api.php/articles')
        console.log(res.data);
        console.log(typeof res.data[0].id)
    }catch(e){
        console.log(e);
    }

}
test();

const conString = `mongodb://PatrikTorn97:Kalezaya11@ds163054.mlab.com:63054/viikkis`;
const connect = mongoose.connect(conString, {useNewUrlParser:true}, (err, success) => {
    if(err) console.log('Mongoose not connected')
    else console.log("Mongoose connected")
});

const articleSchema = new mongoose.Schema({
    year:{
        type:Number,
        required:true
    },
    week:{
        type:Number,
        required:true
    },
    position:{
        type:Number,
        default:1
    },
    title: {
        type:Map,
        default:{
            fi:'Suoomeksi',
            en:'Englanniksi'
        }
    },
    text: {
        type:Map,
        default:{
            fi:'Suoomeksi',
            en:'Englanniksi'
        }
    }
});

const articleModel = mongoose.model('Article', articleSchema);

function createArticle(params){
    return articleModel.create(params);
}

function getArticles(){
    return articleModel.find()
}

function findArticle(params){
    return articleModel.findOne(params)
}

function updateArticle(id, {text}){
    return articeModel.findByIdAndUpdate(
        id,
        {
            text:{
                fi:text,
                en:text
            }
        },
        {new: false},
    );
}


const mysql = require('mysql2')
const Client = require('ssh2').Client
const ssh = new Client();
const mongoose = require('mongoose');