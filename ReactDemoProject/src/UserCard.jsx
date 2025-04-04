const userData=[
  {
  name:"Itachi",
  city:"Hidden Leaf",
  domain:"Beyond Hokage", 
  skills:["Scriptwriting", "Character Development", "World-Building", "Story Arcs", "Plot Development", "Dialogue Writing"]
  ,
  online:true,
  profile:"assets/Itachi uciha aesthetic.PNG"
},
{
  name:"Jaiganesh",
  city:"Chennai",
  domain:"Development", 
  skills:["UI / UX Design", "Java", "Figma", "Adobe XD", "Wireframing", "Front end developer"],
  online:false,
  profile:"assets/apple.gif"
},
{
  name:"Eren Yeager",
  city:"Shiganshina",
  domain:"Protagonist", 
  skills:["Sketch", "Adobe Illustrator", "User Research", "Usability Testing", "Visual Design", "Prototyping"],
  online:true,
  profile:"assets/ᴇʀᴇɴ ᴊᴇᴀɢᴇʀ ɪᴄᴏɴ.jfif"
}
]

function User(props){
    return <div className="card-container">
            <span className={props.online?"pro online": "pro offline"}>{props.online? "ONLINE":"OFFLINE"}</span>
            <img src={props.profile} className="img" alt="User"/>
            <h3>{props.name}</h3>
            <h3>{props.city}</h3>
            <p>{props.domain}</p>
            <div className="buttons">
                <button className="primary">Message</button>
                <button className="primary outline">Following</button>
            </div>
            <div className="skills">
                <h6>Skills</h6>
                <ul>
                    {props.skills.map((skill,index)=>(
                      <li key={index}>{skill}</li>
                    ))}
                </ul>
            </div>
    </div>
}
const UserCard = () => {
  return (
    // <div>
    //   <User name="Itachi" city="Hidden Leaf" domain="Beyond Hokage" 
    //   skills={["UI / UX Design", "Java", "Figma", "Adobe XD", "Wireframing", "Front end developer"]}
    //   online={true} profile="assets/img.jpg" />
    // </div>
    <>
    {userData.map((user, index)=>(
      <User key={index}
       name={user.name}
       city={user.city} 
       domain={user.domain} 
       skills={user.skills} 
       online={user.online} 
       profile={user.profile} />
    ))}
    </>
  )
}

export default UserCard
