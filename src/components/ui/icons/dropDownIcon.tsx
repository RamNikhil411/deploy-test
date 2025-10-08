const DropDownIcon = ({ className }: { className?: string }) => {
    return (
        <svg className={className} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1" width="22" height="22" rx="5.5" fill="#75A237" />
            <path d="M18.358 9.25L13.3055 14.3025C12.7088 14.8992 11.7324 14.8992 11.1358 14.3025L6.08325 9.25" stroke="white" strokeWidth="1.16238" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default DropDownIcon;
