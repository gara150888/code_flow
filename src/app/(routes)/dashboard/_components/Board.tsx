"use client";

import { useEffect } from "react";

const Board = ({ run, data }: { run: () => Promise<string | undefined>, data: string }) => {

    useEffect(() => {
        run();
    }, [])

    return (
        <div>
            <button onClick={run}>Start</button>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}

export default Board