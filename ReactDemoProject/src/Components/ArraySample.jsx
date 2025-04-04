
const ArraySample = (props) => {
    const {items} =props;
  return (
    <div>
      <h2>Items List</h2>
      <ul>
        {items.map((item)=>(
            <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ArraySample
