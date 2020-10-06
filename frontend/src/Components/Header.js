import React from 'react'
import ReactDOM from 'react-dom'

function Header() {
    return(
        <div style={head}>
                <p>fookbace</p>
        </div>
    );
}
const head = {
    fontSize : "40px",
    fontWeight : 'bold',
    color : 'white',
    backgroundColor : 'red',
    border: "red solid",
    width: '100%',
    paddingTop: "30px",
    paddingLeft: '20px',
}
export default Header;