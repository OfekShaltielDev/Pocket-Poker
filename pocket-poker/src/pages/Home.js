import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect } from "react";
import { Fragment } from "react";
import { createClient } from "@supabase/supabase-js";

// const { unityProvider } = useUnityContext({
//     loaderUrl: "Build/poker-webgl.loader.js",
//     dataUrl: "Build/poker-webgl.data",
//     frameworkUrl: "Build/poker-webgl.framework.js",
//     codeUrl: "Build/poker-webgl.wasm",
//   });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

export const Home = () => {
    const { unityProvider, addEventListener, removeEventListener } =
        useUnityContext({
            loaderUrl: "Build/poker-webgl.loader.js",
            dataUrl: "Build/poker-webgl.data",
            frameworkUrl: "Build/poker-webgl.framework.js",
            codeUrl: "Build/poker-webgl.wasm",
    });


    // Upload data to Supabase here
    // winner > 0 if player wins
    // winner < 0 if bot wins
    // winner = 0 if there is a tie
    const handleResults = async (winner, prizePool, winningHandId, losingHandId) => {
        // Fetches the player's id
        const {data: userData} = await supabase.auth.getSession()
        if (userData.session == null){ return; }
        const supabase_user_id = userData.session.user.id
        const player_id_query = await supabase.from('player_stats').select('id').eq('user_id', supabase_user_id)
        if (userData.session == null){ return; }
        const player_id = player_id_query.data[0].id
        console.log(userData.session.user.id)
        
        if (userData.session != null){
            let bot_id = 0;

            // Decides who won or lost
            let winnerId;
            let loserId;
            if (winner > 0){
                winnerId = player_id;
                loserId = bot_id;
            } else if (winner < 0) {
                winnerId = bot_id;
                loserId = player_id;
            } else {
                console.log("Match resulting in a tie. Transaction not reported.")
                return;
            }

            // Sends transaction entry to database
            const { data, error } = await supabase
            .from('transaction')
            .insert({
                winner_id: winnerId,
                loser_id: loserId,
                winner_hand_id: winningHandId,
                losing_hand_id: losingHandId,
                prize_pool: prizePool
            }).select()
            if (error == null){
                console.log(data)
            } else {
                console.log("Error in reporting data.")
                console.log(error)
            }
        }
    }
  
    useEffect(() => {
      addEventListener("handleResults", handleResults);
      return () => {
        removeEventListener("handleResults", handleResults);
      };
    }, [addEventListener, removeEventListener, handleResults]);
  
    return (
      <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
      >
        <Unity
            style={{
                width: "90%",
                justifySelf: "center",
                alignSelf: "center",
            }}
            unityProvider={unityProvider}
        />
      </div>
    );
}
export default Home;
