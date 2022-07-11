import React, {useState} from "react";
import Modal from "../Modal";
import friend from "../../assets/images/friend.png";


export default function Friends (){
  const [show, setShow] = useState(false);


  return (
    <div className="Friends">
      <button className="lobby-btn" onClick={() => setShow(true)}>
        <img src={friend} alt="Friends"/><span>Friends</span>
      </button>
    
    {show && 
    <form>
      <Modal title="Friends" onClose={() => setShow(false)}>
        <div>
          <p className="join-modal-body">Search users to add to friends!!</p>
          <input
          className="user-search input"
          type="text"
          placeholder="Search username"
          name="search"
          ></input>
        </div>
        <div>
         <p className=" join-modal-body mt-3">See who's online</p>
        </div>
      </Modal>
    </form>
    }
    </div>
  )
}


