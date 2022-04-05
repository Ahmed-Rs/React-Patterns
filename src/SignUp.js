import * as React from "react";

function Inscription() {
  const [email, setEmail] = React.useState();
  const [error, setError] = React.useState();

  const onHandleChange = event => {
    setEmail(event.target.value);
    setError(
      event.target.value.includes("@") ? null : "Invalide Email Address",
    )
  }

  const onHandleSubmit = event => {
    event.preventDefault();
    if (!email.includes("@")) {
      console.error("Please enter a valid email address.");
    } else {
      alert(`Hello ${email}`);
    }
  };

  return (
    <div className="formulaire">
      <form onSubmit={onHandleSubmit}>
        <label>Nom:
          <input type="text" name="nom" placeholder="Enter your name" />
        </label>
        <label>Prénom:
          <input type="text" name="prénom" placeholder="Enter your Nick Name" />
        </label>
        <label>Adresse Mail:
          <input onChange={onHandleChange} type="mail" name="mail" placeholder="Enter your Mail Address" />
        </label>
        <div style={{color: 'red'}}>{error}</div>
        <label>Password:
          <input type="text" name="password" placeholder="Enter your password" />
        </label>
        <input type="submit" value="Connexion" />
      </form>
    </div>
  );
}

export default Inscription;
