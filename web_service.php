<?php
    
    class RedeemAPI {
        private $db;
        
        // Constructor - open DB connection
        function __construct() {
            $this->db = new mysqli('localhost', 'valente666', '', 'my_valente666');
            $this->db->autocommit(FALSE);
        }
        
        // Destructor - close DB connection
        function __destruct() {
            $this->db->close();
        }
        
        // Main method to redeem a code
        function redeem() {
            // Print all codes in database
            $stmt = $this->db->prepare('SELECT id, anno, relatore, cv, abstract, serata, titolo_abstract, orario, video, pdf, youtube FROM utente');
            $stmt->bind_result($id, $anno, $relatore, $cv, $abstract, $serata, $titolo_abstract, $orario, $video, $pdf, $youtube);
            $stmt->execute();
            $find=0;
            echo '{"utenti": [';
            while ($stmt->fetch()) {
                //break;
                
                // Return unlock code, encoded with JSON
                $result = array(
                                "anno" => $anno,
                                "relatore" => $relatore,
                                "cv" => $cv,
                                "abstract" => $abstract,
                                "serata" => $serata,
                                "titolo_abstract" => $titolo_abstract,
                                "orario" => $orario,
                                "video" => $video,
                                "pdf" => $pdf,
                                "youtube" => $youtube
                                );
                
                header("Content-type: application/json");
                if($find==1)
            	{echo ',';}
                echo json_encode($result);
                $find=1;
            }
            
            
            // Print all codes in database
            $stmt = $this->db->prepare('SELECT id, anno, testo FROM home');
            $stmt->bind_result($id_home, $anno_home, $testo_home);
            $stmt->execute();
            $find=0;
            echo '],"home": [';
            while ($stmt->fetch()) {
                //break;
                
                // Return unlock code, encoded with JSON
                $result = array(
                                "anno" => $anno_home,
                                "testo" => $testo_home
                                );
                
                header("Content-type: application/json");
                if($find==1)
            	{echo ',';}
                echo json_encode($result);
                $find=1;
            }
            
            
            echo ']}';
            //sendResponse(200, json_encode($result));
            //return true;
        }
        
    }
    
    // This is the first thing that gets called when this page is loaded
    // Creates a new instance of the RedeemAPI class and calls the redeem method
    $api = new RedeemAPI;
    $api->redeem();
    
    ?>
