PopupString=`<html><script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><\/script>
        <script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"><\/script>
        <script src="https://code.jquery.com/jquery-3.6.1.min.js"
                          integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ="
                          crossorigin="anonymous"><\/script>
        <form action="/popup" method="POST" id="take">
     <fieldset>
<div><label for="Attribute1">Attribute1</label><input type="text" id="Attribute1" name="Attribute1" value="" required pattern=^.*$ title=""></div>
<div><label for="AttributBeispiel">AttributBeispiel</label><input type="text" id="AttributBeispiel" name="AttributBeispiel" value="" required pattern=^.*$ title=""></div>
<div><label for="Attribute1245">Attribute1245</label><input type="text" id="Attribute1245" name="Attribute1245" value="" required pattern=^.*$ title=""></div>
<div><select name="DomainOperations" id="DomainOperations">
"<option value="Asave">Asave</option>+
"<option value="Bsave">Bsave</option>+
"<option value="Csave">Csave</option>+
"<option value="Dsave">Dsave</option>+
</select>
 `+'<input type="text" id="_id" name="_id" hidden="true" value=${value}><input type="submit" value="Senden"> <div hidden="true" name="Message"'+` 
id="Message">Refreshing...</div> <div style="color:green" hidden="true" name="SubmitSuccess" id="SubmitSuccess">Success</div></fieldset>    
</form><div><label for="history">Objekthistorie</label></div><textarea id="history" name="history rows="6" cols="20"></textarea>
			</html>`
ToolName="Buccalaracca"
