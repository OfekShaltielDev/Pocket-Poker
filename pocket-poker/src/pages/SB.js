import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("key 1", "key 2");

function SB() {
  const [player_stats, setPlayer] = useState([]);

    useEffect(() => {
      getPlayer();
    }, []);

    async function getPlayer() {
      const { data } = await supabase.from("player_stats").select();
      setPlayer(data);
    }

    return (
      <ol>
        {player_stats.map((player) => (
          <><li key={player.username}>{player.username}</li><ul>
            <li key={player.name}>name: {player.name}</li>
            <li key={player.email}>email: {player.email}</li>
            <li key={player.id}>id: {player.id}</li>
            <li key={player.wins}>wins: {player.wins}</li>
          </ul></>
          
        ))}
      </ol>
    );
}

export default SB;
