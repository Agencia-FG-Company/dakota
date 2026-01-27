import React from "react";
import { useCssHandles } from "vtex.css-handles";
const CSS_HANDLES = ["LoggedModalWrapper","loggedModalOption"] as const;

const options = ["/account","/logout"];

const LoggedModal = () => {
    const { handles } = useCssHandles(CSS_HANDLES);

    return <div className={handles.LoggedModalWrapper}>
            {
                options.map((option,index) => {
                    return  <a href={option} className={handles.loggedModalOption} target="_self" key={`${option}-${index}`} title={option}>{option === "/account" ? "Minha Conta" : "Sair"}</a>
                })
            }
    </div>;
}

export default LoggedModal;