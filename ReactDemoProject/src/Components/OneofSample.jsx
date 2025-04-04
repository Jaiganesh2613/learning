
const OneofSample = (props) => {
    const {color} = props;
  return (
    <div style={{backgroundColor: color, padding: "10px",width:"400px", color: "white"}}>
      <p>This component has a background color of {color}.</p>
    </div>
  )
}

export default OneofSample
