
export function User(information:Object){
    <ul>
        {Object.entries(information).map((key,value)=>
            <li>{key} - {value}</li>
        )}
    </ul>
}