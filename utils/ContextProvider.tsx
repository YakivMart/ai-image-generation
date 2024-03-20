import { useState } from "react";
import { DappContext } from "./Context";

const ContextProvider = ({ children }: any) => {
    const [styleId, setStyleId] = useState(1);
    const [shapeId, setShapeId] = useState(-1);
    const [sizeOption, setSizeOption] = useState("");
    const [styleText, setStyleText] = useState("");
    const [prediction, setPrediction] = useState({});
    const [isBuy, setIsBuy] = useState(false);
    const [status, setStatus] = useState("");
    return (
        <DappContext.Provider
            value={{
                styleId,
                setStyleId,
                sizeOption,
                setSizeOption,
                shapeId,
                setShapeId,
                styleText,
                setStyleText,
                prediction,
                setPrediction,
                isBuy,
                setIsBuy,
                status,
                setStatus
            }}
        >
            {children}
        </DappContext.Provider>
    );
};

export default ContextProvider;