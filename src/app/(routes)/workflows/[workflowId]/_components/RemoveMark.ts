import { useEffect } from "react";

export const RemoveMark = () => {
    useEffect(() => {
        const removeAttribution = () => {
            const el = document.querySelector('[data-message="Please only hide this attribution when you are subscribed to React Flow Pro: https://reactflow.dev/attribution"]');
            if (el) el.remove();
        };

        removeAttribution();
        const observer = new MutationObserver(removeAttribution);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, []);
}