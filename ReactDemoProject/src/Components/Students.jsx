import PropTypes from "prop-types";
const Students = (props) => {
  return (
    <div className="Student">
        <table>
            <tbody>
                <tr>
                    <th>
                    Name
                    </th>
                    <td>{props.name}</td>
                </tr>
                <tr>
                    <th>
                    Age
                    </th>
                    <td>{props.age}</td>
                </tr>
                <tr>
                    <th>
                    isMarried
                    </th>
                    <td>{props.isMarried? "Yes" : "No"}</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Students

Students.proptypes={
    name : PropTypes.string,
    age : PropTypes.number,
    isMarried : PropTypes.bool
}

Students.defaultProps={
    name : "No Name",
    age : 0,
    isMarried : false
}