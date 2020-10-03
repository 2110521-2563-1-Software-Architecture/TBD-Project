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
    height: '100px',
    paddingLeft: '20px',
    paddingBottom: '5px'
}
export default Header;