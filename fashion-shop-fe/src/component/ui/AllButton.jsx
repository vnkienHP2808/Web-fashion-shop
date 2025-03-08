const AllButton = ({ text, href }) => {
    return (
      <div className="headline">
        <a
        href={href}
        style={{
          textDecoration: "none",
        }}
      >
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            border: "1px solid #333",
            backgroundColor: "transparent",
            cursor: "pointer",
            borderRadius: "20px",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "black";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "black";
          }}
        >
          {text}
        </button>
      </a>
      </div>
    );
  };
  
  export default AllButton;
  