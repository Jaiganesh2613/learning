// JavaScript Document
var secFor = "sec"; //default value to know which thickbox
var secQ = 0; //default secret question
var newemail = ""; //updated email value
var adop = "N"; //updated adult option
var achoice = "OFF"; //updated adult option description
var nicksec = "Y"; //updated nick security
var nchoice = "DISABLED"; //updated nick security description
var usub = false; //user subscribed
var vgift = "N"; //has vgift
var room = "N"; //has premium room
var roomcap = "250"; //premium room max members
var hasEm = false;
var disconnect = "";
var download_modal = false;
var optindb = 0;
var xmlHttp;

function securityInfo(jsfor) {
    document.frmSqSa.reset();
    document.frmChangeEmail.reset();
    document.frmChangePass.reset();
    //document.getElementById('sqsa-error').className='error hide';

    if((jsfor=='sec-email' || jsfor=='sec-pass') && !bAllowEmailorPassChange){
        hideOtherBoxes("success");
        var secChangeFor = jsfor=='sec-email' ? "email" : "password";
        document.getElementById('success').className='show';
        document.getElementById('success-header').innerHTML="Change "+secChangeFor;
        document.getElementById('success-msg').innerHTML="Sorry, "+secChangeFor+" change is currently not allowed.";
        return false;
    } else {
        hideOtherBoxes("security");
        secFor = jsfor;
    }
}
function successInfo() {
    hideOtherBoxes("success");
}
function showEmSqSa() {
    hideOtherBoxes("em-sqsa");
    if(secFor == "new-email") {
        document.getElementById("em-sqsa-desc").innerHTML = "Please complete your registration by providing your email address for account identification purposes.";
        document.getElementById("em-sq").className = "hide";
    } else {
        secFor = "em-sqsa";
    }
}
function changePassword() {
    document.getElementById('sqsa-error').className='hide';
    document.getElementById('thickbox').className='show';
    document.getElementById('security').className='show';
}
function showPassword() {
    hideBackdrop();
    showThickbox();
    document.getElementById('security').className='hide';
    document.getElementById('change-email').className='hide';
    document.getElementById('change-pass').className='show';
    document.getElementById('pass-error').className='error hide';
}
function showEmail() {
    hideBackdrop();
    showThickbox();
    document.getElementById('security').className='hide';
    document.getElementById('change-pass').className='hide';
    document.getElementById('everify').className='hide';
    document.getElementById('change-email').className='show';
    document.getElementById('email-error').className='error hide';
}
function showSecError(err) {
    document.getElementById('sqsa-error').className='error-msg';
    document.getElementById('sqsa-error').innerHTML=err;
    if(err.indexOf("expired")>=0 || err.indexOf("browser")>=0 || err.indexOf("Invalid security auth status")>=0) {
        secFor = "session-expired";
    }
}
function showPassError(err) {
    document.getElementById('pass-error').className='error show';
    document.getElementById('pass-error').innerHTML=err;
    if(err.trim()=="Invalid security auth status" || err.indexOf("expired")>=0 || err.indexOf("reached the maximum attempts")>=0) {
        secFor = "session-expired";
        if(err.indexOf("reached the maximum attempts")>=0) {
            document.getElementById("frmChangePass").style.display = "none";
        } else {
            closeWindow();
        }

    }
}
function showEmailError(err) {
    document.getElementById('email-error').className='error show';
    document.getElementById('email-error').innerHTML=err;
    if(err.trim()=="Invalid security auth status" || err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}

function showEditEmailError(err){
    document.getElementById('sqsa-error').className='error-msg';
    document.getElementById('sqsa-error').innerHTML=err;
    if(err.trim()=="Invalid security auth status" || err.indexOf("expired")>=0 || err.indexOf("reached the maximum attempts")>=0) {
        secFor = "session-expired";
        if(err.indexOf("reached the maximum attempts")>=0) {
            document.getElementById("frmChangePass").style.display = "none";
        } else {
            closeWindow();
        }

    }
}

function showPassSuccess() {
    document.getElementById('change-pass').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Password";
    document.getElementById('success-msg').innerHTML="Your password has been changed. Please re-login with your new password.";
    secFor = "success-pass";
    /*if(typeof(bAllowEmailorPassChange)!=='undefined') {
        bAllowEmailorPassChange = false;
    }*/
}
function showEmailSuccess() {
    document.getElementById('change-email').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Email Address";
    document.getElementById('success-msg').innerHTML="Your email address has been changed. " +
        "An email with verification link is sent to you. Please verify your email address soon you receive the verification link." +
        " Please re-login for security reasons.";
    secFor = "success-email";
    document.getElementById('emaila').innerHTML = newemail;
    //document.getElementById('verem').style.display='block';
    $("#verem").removeClass("hide");
    document.getElementById('verem').style.display='inline';
    /*if(typeof(bAllowEmailorPassChange)!=='undefined') {
        bAllowEmailorPassChange = false;
    }*/
}
function showVerifyEmail() {
    secFor = "sec";
    resetEmailVerify();
    hideOtherBoxes("everify");
    /*	document.getElementById('resend').className='show';
        document.getElementById('vemail-error').className='error hide';
        document.getElementById('resend-error').className='error hide';
        document.getElementById('frmEmailVerify').reset();
        if(secFor=="em-sqsa-success") {
            document.getElementById("verf-msg").innerHTML="<b>Registration complete!</b> An email with verification code is sent to you. Please verify your email address by entering the verification code here.";
        } */
}
function showVEmError(err) {
    $("#error-msg").text(err);
    $("#error-msg").removeClass("hide");
    $("#error-msg").addClass("error-msg");
    $("#success-msg-email").text("");
    $("#success-msg-email").addClass("hide");
    $(".modal-body").animate({ scrollTop: "0" });
    if(err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function showVEmSuccess() {
    showVerifiedSuccess();
    secFor = "vem-success";
}
function showResendError(err) {
    $("#resend-code").removeClass("hide");
    $("#resend-code").removeClass("success-msg");
    $("#resend-code").addClass("error-msg");
    $("#resend-code").text(err);
    if(err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function showResendSuccess() {
    $("#resend-code").removeClass("hide");
    $("#resend-code").removeClass("error-msg");
    $("#resend-code").addClass("success-msg");
    $("#resend-code").text("Verification code email sent");
    secFor="resend-success";
}
function showAdultOp() {
    hideOtherBoxes("adult-opt");
}
function showAdultOpSuccess() {
    document.getElementById('adult-opt').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Adult Setting";
    document.getElementById('success-msg').innerHTML="Adult setting has been changed to "+achoice;
    document.getElementById('adult').innerHTML = achoice;
    if(achoice=="ON") {
        document.frmAdult.adult[0].checked = true;
        adop = "Y";
    } else {
        document.frmAdult.adult[1].checked = true;
        adop = "N";
    }
}
function showAdultOpError(err) {
    document.getElementById('adop-error').className='error show';
    document.getElementById('adop-error').innerHTML=err;
    if(err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function showNickSec() {
    document.frmNickSec.reset();
    hideOtherBoxes("nick-sec");
}
function showNickSecSuccess() {
    document.getElementById('nick-sec').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Nickname Security";
    document.getElementById('success-msg').innerHTML="Nickname Security is now "+nchoice;
    document.getElementById('nicksec').innerHTML = nchoice;
    secFor = "success-nicksec";
}
function showNickSecError(err) {
    document.getElementById('nicksec-error').className='error show';
    document.getElementById('nicksec-error').innerHTML=err;
    if(err!=null && err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function changeNickSec() {
    secFor = "change-nicksec";
    var selNickSec = document.frmNickSec.nicksec[0].checked ? "Y" : "N";
    nchoice = selNickSec == "Y" ? "ENABLED" : "DISABLED";
    if(nicksec!=selNickSec) {
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.ChangePassport";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "nicksec="+selNickSec+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    } else {
        alert("You haven't changed the Nickname Security");
        secFor = "sec";
        return;
    }
}
function changeAdult() {
    secFor = "adop";
    var selAdOpt = document.frmAdult.adult[0].checked ? "Y" : "N";
    achoice = selAdOpt == "Y" ? "ON" : "OFF";
    if(adop!=selAdOpt) {
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "action=adop&adult="+selAdOpt+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    } else {
        alert("You haven't changed the adult setting");
        return;
    }
}
function showDisconnectSuccess() {
    document.getElementById('thickbox').className='show';
    document.getElementById('tb-window').className='show';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Disconnect Success";
    document.getElementById('success-msg').innerHTML="Your "+disconnect+" account has been disconnected.";
    secFor = "disc-oauth-success";
}
function showDisconnectError(responseVal) {
    document.getElementById('thickbox').className='show';
    document.getElementById('tb-window').className='show';
    document.getElementById('success').className='show';
    document.getElementById('h3cp').innerHTML = 'Disconnect Error';
    document.getElementById('success-header').innerHTML="Disconnecting "+disconnect +" account failed";
    document.getElementById('success-msg').innerHTML="We were unable to disconnect "+disconnect+" account as <br/>" + responseVal +"<br/>Please contact Paltalk Support.";
}
function validateSA(){
    if(document.frmSqSa.sa.value.trim().length==0) {
        callSecErrorMsg("Please enter a Secret Answer");
        document.frmSqSa.sa.focus();
        return false;
    } else if(isMetaCharacter(document.frmSqSa.sa.value)) {
        callSecErrorMsg("Please enter alphabetic and numbers only");
        document.frmSqSa.sa.focus();
        return false;
    } else if ((document.frmSqSa.sa.value==null)||(!CheckTxtValue(document.frmSqSa.sa))) {
        callSecErrorMsg("Please enter a Secret Answer");
        document.frmSqSa.sa.focus();
        return false;
    } else if(document.frmSqSa.sa.value.trim().length>15) {
        callSecErrorMsg("Max length of Secret Answer is 15 characters");
        document.frmSqSa.sa.focus();
        return false;
    } else if(secQ==0) {
        if( /[^a-zA-Z0-9 ]/.test(document.frmSqSa.sa.value.trim()) ) {
            callSecErrorMsg("Please enter alphabetic and numbers only");
            return false;
        }
    }
    return true;
}
function validateSQ(){
    if(document.frmSqSa.sq.value==0) {
        callSecErrorMsg("Please choose a Secret Question");
        document.frmSqSa.sq.focus();
        return false;
    }
    return true;
}
function validateSqSa() {

    if(secQ==0 && !validateSQ()) return;

    if(!validateSA()) {
        //if(secQ==0) alert("Secret Answer - Please enter alphabetic and numbers only");
        //else alert("Please enter a valid secret answer");
        return;
    } else {
        //alert("validation success");
    }

    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.AuthSecurity";
    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var sq = document.frmSqSa.sq.value;
    var sa = document.frmSqSa.sa.value;
    var params = "sq="+sq+"&sa="+sa+"&pwoft="+webToken.get();
    xmlHttp.send(params);
}
function validateEmSqSa(frmObject) {
    if(secFor=="em-new") secFor="new-email";
    if(secFor!="new-email") secFor = "em-sqsa";

    var jsEmailCheck = commonEmailChecks(frmObject);
    if(jsEmailCheck==0) return;
    var jsEmailAdd = frmObject.email.value.trim().toLowerCase();
    var jsConfEmailAdd = frmObject.confirm_email.value.trim().toLowerCase();
    var jsShowEmailAdd = frmObject.show_email[0].checked ? frmObject.show_email[0].value : frmObject.show_email[1].value;

    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.AuthSecurity";
    var params = "email="+jsEmailAdd+"&confirm_email="+jsConfEmailAdd+"&show_email="+jsShowEmailAdd+"&pwoft="+webToken.get();

    if(secFor=="new-email") {
        secFor = "em-new";
        url = "/mpt/ControllerServlet?RequestId=MyPalTalk.ChangeEmail";
    } else {
        if(frmObject.sq.value==0) {
            alert("Please choose a Secret Question");
            frmObject.sq.focus();
            return;
        }
        if(frmObject.sa.value.trim().length==0) {
            alert("Please enter a Secret Answer");
            frmObject.sa.focus();
            return;
        } else if(isMetaCharacter(frmObject.sa.value)) {
            alert("Please enter alphabetic and numbers only");
            frmObject.sa.focus();
            return;
        } else if ((frmObject.sa.value==null)||(!CheckTxtValue(frmObject.sa))) {
            alert("Please enter a Secret Answer");
            frmObject.sa.focus();
            return;
        } else if(frmObject.sa.value.trim().length>15) {
            alert("Max length of Secret Answer is 15 characters");
            frmObject.sa.focus();
            return;
        } else if( /[^a-zA-Z0-9 ]/.test(frmObject.sa.value.trim()) ) {
            alert("Please enter alphabetic and/or numbers only");
            return;
        }
        params = "sq="+frmObject.sq.value+"&sa="+frmObject.sa.value+"&from=em-sqsa&"+params;
        params = params + "&pwoft="+webToken.get();
    }

    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }

    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlHttp.send(params);
}
function validatePass() {
    secFor = "change-pass";
    if(isEmpty(document.frmChangePass.currentpwd)) {
        alert("Please enter your current password");
        document.frmChangePass.currentpwd.focus();
        return;
    }

    if(isEmpty(document.frmChangePass.newpwd)) {
        alert("Please enter your new password");
        document.frmChangePass.newpwd.focus();
        return;
    }

    if((document.frmChangePass.newpwd.value).trim().length<pwdmin || (document.frmChangePass.newpwd.value).trim().length>pwdmax) {
        alert("Password must be between "+pwdmin+"-"+pwdmax+" characters long");
        document.frmChangePass.newpwd.focus();
        return;
    }
    if(isMetaCharacter(document.frmChangePass.newpwd.value) || /[^a-zA-Z0-9]/.test(document.frmChangePass.newpwd.value.trim())) {
        alert("Please enter alphabets and/or numbers only")
        document.frmChangePass.newpwd.focus();
        return;
    }

    if(isEmpty(document.frmChangePass.confirmpwd)) {
        alert("Please re-type your new password.");
        document.frmChangePass.confirmpwd.focus();
        return;
    }
    if(isMetaCharacter(document.frmChangePass.confirmpwd.value) || /[^a-zA-Z0-9]/.test(document.frmChangePass.confirmpwd.value.trim())) {
        alert("Please enter alphabets and/or numbers only");
        document.frmChangePass.confirmpwd.focus();
        return;
    }


    if(document.frmChangePass.newpwd.value == document.frmChangePass.currentpwd.value) {
        alert("Current password and New password cannot be same");
        document.frmChangePass.newpwd.focus();
        return;
    }

    if(document.frmChangePass.newpwd.value != document.frmChangePass.confirmpwd.value) {
        alert("New password and re-type new password must be the same");
        document.frmChangePass.confirmpwd.focus();
        return;
    }

    var cp = document.frmChangePass.currentpwd.value.trim();
    var np = document.frmChangePass.newpwd.value.trim();
    var fp = document.frmChangePass.confirmpwd.value.trim();
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.ChangePass";
    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "currentpwd="+cp+"&newpwd="+np+"&confirmpwd="+fp+"&pwoft="+webToken.get();
    xmlHttp.send(params);
}

function updateShowEmail() {
    secFor = "change-email";
}

function validateEmailAddress(jsShowEmail){
    secFor = "change-email";
    jsShowEmail = jsShowEmail == null ? "N" : jsShowEmail.toUpperCase() == "Y" ? "Y" : "N";

    var jsNow = document.frmChangeEmail.show_email[0].checked ? document.frmChangeEmail.show_email[0].value : document.frmChangeEmail.show_email[1].value;

    if(hasEm && document.frmChangeEmail.email.value.trim().length==0 && document.frmChangeEmail.confirm_email.value.trim().length==0 && jsShowEmail!=jsNow) {
        updateShowEmail(); //user changed show/hide email alone
    } else { //user changed email
        if (hasEm && isBothStringsEqual(document.frmChangeEmail.email.value.trim(), document.frmChangeEmail.current_email.value.trim())){
            alert("Current email and New email are the same");
            document.frmChangeEmail.email.value = "";
            document.frmChangeEmail.email.focus();
            return;
        }
        if ((document.frmChangeEmail.email.value.indexOf ('.', 0) == -1) || (document.frmChangeEmail.email.value.indexOf ('@', 0) == -1)) {
            alert("Please enter valid email address & ensure the email must be in the format : name@place.domain");
            document.frmChangeEmail.email.focus();
            return;
        }
        if (document.frmChangeEmail.email.value.trim().indexOf (' ', 0) > 0) {
            alert("Please enter valid email address & ensure the email must be in the format : name@place.domain");
            document.frmChangeEmail.email.focus();
            return;
        }
        var iIndex = document.frmChangeEmail.email.value.indexOf ('@', 0);
        var sEmailpart = document.frmChangeEmail.email.value.substr(0,iIndex);
        if (sEmailpart == null || sEmailpart.trim() == ""){
            alert("Please enter valid email address & ensure the email must be in the format : name@place.domain");
            document.frmChangeEmail.email.focus();
            return;
        }

        var sEmErr = validateEmail(document.frmChangeEmail.email.value.trim());
        if(sEmErr!="")	{
            alert(sEmErr+"\n Please enter valid email & ensure the email must be in the format : name@place.domain ");
            document.frmChangeEmail.email.focus();
            return;
        }

        // check for AOL user.
        var iIndex = document.frmChangeEmail.email.value.trim().indexOf ('@aol.com', 0);
        if(iIndex >= 0){
            var sEmailpart = document.frmChangeEmail.email.value.trim().substr(0,iIndex);
            if (sEmailpart.length < 3 || sEmailpart.length > 16){
                alert("Invalid email length for AOL email, Please enter correct email address.");
                return;
            }
            if ((sEmailpart.indexOf(',', 0) >= 0)||
                (sEmailpart.indexOf('-', 0) >= 0)||
                (sEmailpart.indexOf('.', 0) >= 0)||
                (sEmailpart.indexOf('_', 0) >= 0)){
                alert("No special chars allowed, Please enter correct email address.");
                return;
            }

            if (sEmailpart.substring(0,1) >="0" && sEmailpart.substring(0,1) <="9"){
                alert("First character cannot be numeric, Please enter correct email address.");
                return;
            }
        }

        if(isEmpty(document.frmChangeEmail.confirm_email)){
            alert("Please re-type your New Email Address.");
            document.frmChangeEmail.confirm_email.focus();
            return;
        }

        if(document.frmChangeEmail.email.value.trim() != document.frmChangeEmail.confirm_email.value.trim()) {
            alert("Your new email and re-type new email should be same!");
            document.frmChangeEmail.confirm_email.value="";
            document.frmChangeEmail.confirm_email.focus();
            return;
        }

        var cem = document.frmChangeEmail.current_email.value.trim();
        var nem = document.frmChangeEmail.email.value.trim();
        var fem = document.frmChangeEmail.confirm_email.value.trim();
        var sem = jsNow; //show_email
        secFor="change-email";
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.ChangeEmail";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "email="+nem+"&confirm_email="+fem+"&show_email="+sem+"&pwoft="+webToken.get();
        newemail = nem; //for display
        xmlHttp.send(params);
    } //end of else part
}
function commonEmailChecks(frmObject) {
    if ((frmObject.email.value.indexOf ('.', 0) == -1) || (frmObject.email.value.indexOf ('@', 0) == -1)) {
        alert("Please enter valid email address & ensure the email must be in the format : name@place.domain");
        frmObject.email.focus();
        return 0;
    }
    if (frmObject.email.value.trim().indexOf (' ', 0) > 0) {
        alert("Please enter valid email address & ensure the email must be in the format : name@place.domain");
        frmObject.email.focus();
        return 0;
    }
    var iIndex = frmObject.email.value.indexOf ('@', 0);
    var sEmailpart = frmObject.email.value.substr(0,iIndex);
    if (sEmailpart == null || sEmailpart.trim() == ""){
        alert("Please enter valid email address & ensure the email must be in the format : name@place.domain");
        frmObject.email.focus();
        return 0;
    }

    var sEmErr = validateEmail(frmObject.email.value.trim());
    if(sEmErr!="")	{
        alert(sEmErr+"\n Please enter valid email & ensure the email must be in the format : name@place.domain ");
        frmObject.email.focus();
        return 0;
    }

    // check for AOL user.
    var iIndex = frmObject.email.value.trim().indexOf ('@aol.com', 0);
    if(iIndex >= 0){
        var sEmailpart = frmObject.email.value.trim().substr(0,iIndex);
        if (sEmailpart.length < 3 || sEmailpart.length > 16){
            alert("Invalid email length for AOL email, Please enter correct email address.");
            return 0;
        }
        if ((sEmailpart.indexOf(',', 0) >= 0)||
            (sEmailpart.indexOf('-', 0) >= 0)||
            (sEmailpart.indexOf('.', 0) >= 0)||
            (sEmailpart.indexOf('_', 0) >= 0)){
            alert("No special chars allowed, please enter correct email address.");
            return 0;
        }

        if (sEmailpart.substring(0,1) >="0" && sEmailpart.substring(0,1) <="9"){
            alert("First character cannot be numeric, please enter correct email address.");
            return 0;
        }
    }

    if(isEmpty(frmObject.confirm_email)){
        alert("Please re-type your Email Address.");
        frmObject.confirm_email.focus();
        return 0;
    }

    if(frmObject.email.value.trim() != frmObject.confirm_email.value.trim()) {
        alert("Your Email and re-type email should be same!");
        frmObject.confirm_email.value="";
        frmObject.confirm_email.focus();
        return 0;
    }

    return 1;
}
function showEmSqSaSuccess() {
    document.getElementById('em-sqsa').className='hide';
    secFor = "em-sqsa-success";
    showVerifyEmail();
}
function showEmSqSaError(err) {
    document.getElementById('em-sqsa-error').className='error show';
    document.getElementById('em-sqsa-error').innerHTML=err;
}
function validateEcode() {
    var vcode =$("input[name=verification-code]");
    secFor="verify-email";
    if(vcode.val().trim().length==0) {
        $("#success-msg-email").text("");
        $("#success-msg-email").addClass("hide");
        $("#error-msg").removeClass("hide");
        $("#error-msg").text("Please enter the verification code");
        $(".modal-body").animate({ scrollTop: "0" });
        return;
    }

    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.VerifyEmailCode";
    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "emailcode="+vcode.val().trim() + "&pwoft="+webToken.get();
    xmlHttp.send(params);
}
function resendCode() {
    secFor="resend-code";
    var email_value = $("input[name=user-email]").val();
    var email_place_holder = $("input[name=user-email]").prop("placeholder");


    if($("#error-msg").text().trim()==="You have entered an invalid email address" && !$("#error-msg").hasClass("hide")){
        $("#success-msg-email").addClass("hide");
        $("#success-msg-email").text("");
        $("#error-msg").removeClass("hide");
        $("#error-msg").text("Please enter valid email first");
        $("#error-msg").addClass("error-msg");
        return;
    }

    if(email_value.trim().length==0 && email_place_holder.trim().length==0){
        $("#success-msg-email").addClass("hide");
        $("#success-msg-email").text("");
        $("#error-msg").removeClass("hide");
        $("#error-msg").text("Please enter valid email first");
        $("#error-msg").addClass("error-msg");
        return;
    }
    //document.getElementById("resend").className = "hide";
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert("Your browser does not support AJAX!");
        return;
    }
    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.ResendEmailCode";
    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "emailcode=y&pwoft=" + webToken.get();
    xmlHttp.send(params);
}
function isMetaCharacter(p_val){
    var validchars = "<>";
    var parm1 = p_val.toUpperCase();
    for (var i=0; i<parm1.length; i++) {
        temp = "" + parm1.substring(i, i+1);
        if (validchars.indexOf(temp) >= 0 && temp != " ") {
            return true;
        }
    }
    return false;
}
function CheckTxtValue(frm_fld){
    if (frm_fld.value.length < 1){
        return false;
    } else {
        var strInput = new String(frm_fld.value);
        if (strInput.trim()=="") {
            return false;
        }
        return true;
    }
    return true;
}
function disconnectOAuth(jsVal) {
    disconnect = jsVal;
    secFor = "disc-oauth";
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.DeleteOAuth";
    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "provider="+disconnect;
    xmlHttp.send(params);
}
function showVideoWallForm(jsVal) {
    //alert("showVideoWallForm: idx: "+jsVal);
    hideOtherBoxes("vidwall");
    if(jsVal=="Y") {
        document.frmVidWall.vidwall[0].checked = true;
        vidwalloptout = "Y";
    } else {
        document.frmVidWall.vidwall[1].checked = true;
        vidwalloptout = "N";
    }
}
function showVideoWallSuccess(jsVal) {
    //alert("showVideoWallSuccess "+jsVal);
    hideOtherBoxes("success");
    document.getElementById('success-header').innerHTML="Live Video Wall Setting Changed";
    if(jsVal=="Y" || document.frmVidWall.vidwall[0].checked) {
        window.parent.vidwalloptout = "YES";
    } else {
        window.parent.vidwalloptout = "NO";
    }
    document.getElementById('success-msg').innerHTML=" You have opted "+(jsVal=="Y"? "OUT of" : "IN to")+" the Paltalk Live Video Wall";
    document.getElementById('livevidwall').innerHTML = (jsVal=="Y") ? "DISABLED" : "ENABLED";
    secFor="vidwall-success";
}
function showVideoWallError(jsFrom, jsVal) {
    //alert("showVideoWallError: jsFrom:"+jsFrom+", "+jsVal);
    document.getElementById('thickbox').className='show';
    document.getElementById('tb-window').className='show';
    document.getElementById('success').className='hide';
    document.getElementById('vidwall').className='show';
    document.getElementById("vidwall-error").className = "error show";
    if(jsFrom=="change") document.getElementById("vidwall-error").innerHTML = "Unable to change the video opt out setting. Contact Paltalk Support.";
    else document.getElementById("vidwall-error").innerHTML = "Unable to show the video opt out setting. Contact Paltalk Support.";
}
function showVideoWallSetting() {
    secFor = "vidwall-show";
    if(vidwalloptout=="Y") {
        document.frmVidWall.vidwall[0].checked = true;
        document.frmVidWall.vidwall[1].checked = false;
    } else if(vidwalloptout=="N") {
        document.frmVidWall.vidwall[1].checked = true;
        document.frmVidWall.vidwall[0].checked = false;
    }
    else {
        //alert("calling wallsetting");
        document.getElementById("vidwall-error").className = "error hide";
        wallSetting("S");
    }
    hideOtherBoxes("vidwall");
}
function changeVidWall() {
    secFor = "vidwall-change";
    var optout = document.frmVidWall.vidwall[0].checked ? "Y" : "N";
    //alert("optout: "+optout);
    if(vidwalloptout!=optout) wallSetting(optout);
    else {
        alert("You haven't changed the setting");
        secFor="sec";
    }
}
function wallSetting(jsVar) {
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "&action=vidwall&vwset="+jsVar+"&pwoft="+webToken.get();
    xmlHttp.send(params);
}
function showAnonViewOp() {
    hideOtherBoxes("anonview-opt");
    if(document.frmAnonView!=null) {
        if(anon_view == "YES") {
            if(document.frmAnonView.anon_viewing!=null) {
                document.frmAnonView.anon_viewing[0].checked = true;
                document.frmAnonView.anon_viewing[1].checked = false;
            }
        } else {
            if(document.frmAnonView.anon_viewing!=null) {
                document.frmAnonView.anon_viewing[1].checked = true;
                document.frmAnonView.anon_viewing[0].checked = false;
            }
        }
    }
}
function showRoyaltySet() {
    hideOtherBoxes("royaltysup-opt");
    if(document.frmRoyaltySet!=null) {
        if(royalty_sup == "NO") { //0
            if(document.frmRoyaltySet.royalty_suppress!=null) {
                document.frmRoyaltySet.royalty_suppress[0].checked = true;
                document.frmRoyaltySet.royalty_suppress[1].checked = false;
            }
        } else { //1
            if(document.frmRoyaltySet.royalty_suppress!=null) {
                document.frmRoyaltySet.royalty_suppress[1].checked = true;
                document.frmRoyaltySet.royalty_suppress[0].checked = false;
            }
        }
    }
}
function showRoyaltySupSuccess() {
    document.getElementById('royaltysup-opt').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Royalty Suppress Setting";
    if(document.frmRoyaltySet.royalty_suppress[0].checked) {
        window.parent.royalty_sup = "NO";
        document.getElementById('success-msg').innerHTML="Royalty badge is set to show";
        window.parent.document.getElementById("royaltyset").innerText="YES";
    } else {
        window.parent.royalty_sup = "YES";
        document.getElementById('success-msg').innerHTML="Royalty badge is set to hide";
        window.parent.document.getElementById("royaltyset").innerText="NO";
    }
    secFor = "royaltysup-success";
}
function showRoyaltySupError(err) {
    document.getElementById('royaltysup-error').className='error show';
    document.getElementById('royaltysup-error').innerHTML=err;
    if(err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function changeRoyaltySuppress() {
    secFor = "royaltysup";
    var selRoyaltySup = document.frmRoyaltySet.royalty_suppress[0].checked ? "NO" : "YES";
    var royalty_supp_set = document.frmRoyaltySet.royalty_suppress[0].checked ? 0 : 1;
    if(royalty_sup!=selRoyaltySup) {
        royalty_sup = selRoyaltySup;
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "action=royaltysup&royalty_suppress="+ royalty_supp_set+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    } else {
        alert("You haven't changed the setting");
        secFor = "sec";
        return;
    }
}
function showAnonViewOpSuccess() {
    document.getElementById('anonview-opt').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Anonymous View Setting";
    var extramsg = "";
    if(document.frmAnonView.anon_viewing[0].checked) {
        window.parent.anon_view = "YES";
        extramsg = "ANONYMOUS";
    } else {
        window.parent.anon_view = "NO";
        extramsg = "PUBLIC";
    }
    document.getElementById("wvm").innerHTML = extramsg;
    document.getElementById('success-msg').innerHTML="Anonymous View is set to "+anon_view+" ("+extramsg+")";
}
function showAnonViewOpError(err) {
    document.getElementById('anonview-error').className='error show';
    document.getElementById('anonview-error').innerHTML=err;
    if(err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function changeAnonViewing() {
    secFor = "anvi";
    var selAnonViewing = document.frmAnonView.anon_viewing[0].checked ? "YES" : "NO";
    if(anon_view!=selAnonViewing) {
        anon_view = selAnonViewing;
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "action=anvi&anon_viewing="+ selAnonViewing+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    } else {
        alert("You haven't changed the setting");
        secFor = "sec";
        return;
    }
}
function showGroupsImIn() {
    hideOtherBoxes("groupsimin");
    if(showgroupsimin == "Y") {
        if(document.frmGroupsImIn.groupsimin!=null) {
            document.frmGroupsImIn.groupsimin[0].checked = true;
            document.frmGroupsImIn.groupsimin[1].checked = false;
        }
    } else {
        if(document.frmGroupsImIn.groupsimin!=null) {
            document.frmGroupsImIn.groupsimin[1].checked = true;
            document.frmGroupsImIn.groupsimin[0].checked = false;
        }
    }
}
function showGroupsImInSuccess() {
    document.getElementById('groupsimin').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Rooms Im In Setting";
    var extramsg = ""
    if(document.frmGroupsImIn.groupsimin[0].checked) {
        window.parent.showgroupsimin = "Y";
        extramsg = "PUBLIC";
    } else {
        window.parent.showgroupsimin = "N";
        extramsg = "PRIVATE";
    }
    document.getElementById("groups_im_in").innerHTML = extramsg;
    document.getElementById('success-msg').innerHTML="Show Rooms I'm In is set to "+extramsg;
}
function showGroupImInError(err) {
    document.getElementById('groupsimin-error').className='error show';
    document.getElementById('groupsimin-error').innerHTML=err;
    if(err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function changeGroupsImIn() {
    secFor = "grpimin";
    var selGroupsImIn = document.frmGroupsImIn.groupsimin[0].checked ? "Y" : "N";
    if(showgroupsimin!=selGroupsImIn) {
        showgroupsimin = selGroupsImIn;
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "action=groupsimin&groupsimin="+ selGroupsImIn+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    } else {
        alert("You haven't changed the setting");
        secFor = "sec";
        return;
    }
}
function showGroupsIFollow() {
    hideOtherBoxes("groupsifollow");
    if(showgroupsifollow == "Y") {
        if(document.frmGroupsIFollow.groupsifollow!=null) {
            document.frmGroupsIFollow.groupsifollow[0].checked = true;
            document.frmGroupsIFollow.groupsifollow[1].checked = false;
        }
    } else {
        if(document.frmGroupsIFollow.groupsifollow!=null) {
            document.frmGroupsIFollow.groupsifollow[1].checked = true;
            document.frmGroupsIFollow.groupsifollow[0].checked = false;
        }
    }
}
function showGroupsIFollowSuccess() {
    document.getElementById('groupsifollow').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Rooms I Follow Setting";
    var extramsg = ""
    if(document.frmGroupsIFollow.groupsifollow[0].checked) {
        window.parent.showgroupsifollow = "Y";
        extramsg = "PUBLIC";
    } else {
        window.parent.showgroupsifollow = "N";
        extramsg = "PRIVATE";
    }
    document.getElementById("groups_i_follow").innerHTML = extramsg;
    document.getElementById('success-msg').innerHTML="Show Rooms I Follow set to "+extramsg;
}
function showGroupsIFollowError(err) {
    document.getElementById('groupsifollow-error').className='error show';
    document.getElementById('groupsifollow-error').innerHTML=err;
    if(err.indexOf("expired")>=0) {
        secFor = "session-expired";
        closeWindow();
    }
}
function changeGroupsIFollow() {
    secFor = "grpifollow";
    var selGroupsIFollow = document.frmGroupsIFollow.groupsifollow[0].checked ? "Y" : "N";
    if(selGroupsIFollow!=showgroupsifollow) {
        showgroupsifollow = selGroupsIFollow;
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "action=groupsifollow&groupsifollow="+ selGroupsIFollow+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    } else {
        alert("You haven't changed the setting");
        secFor = "sec";
        return;
    }
}
function showNickColors(jsColor, jsRGBColor) {
    hideOtherBoxes("nickcolorsel");
    document.getElementById("nick_appear").style.color = "rgb("+jsRGBColor+")";
    document.getElementById("nickcolorsel-error").className= "error hide";
    document.frmNickColorSel.reset();
    document.frmNickColorSel.nick_color.value = jsColor;
}
function nickColorSelected() {
    document.getElementById("nickcolorsel-error").className = "error hide";
    document.getElementById("nick_appear").style.color = document.frmNickColorSel.sel_nick_color.options[document.frmNickColorSel.sel_nick_color.selectedIndex].id;
    document.frmNickColorSel.nick_color.value = document.frmNickColorSel.sel_nick_color.options[document.frmNickColorSel.sel_nick_color.selectedIndex].value;
}
function changeNickColor(jsCurrentColor) {
    var jsSelectedColor = document.frmNickColorSel.nick_color.value;
    //alert(jsCurrentColor+","+jsSelectedColor);
    if(jsCurrentColor==jsSelectedColor) {
        document.getElementById("nickcolorsel-error").innerHTML = "You haven't changed your color";
        document.getElementById("nickcolorsel-error").className = "error show";
        secFor = "sec";
    } else {
        document.getElementById("nickcolorsel-error").className = "error hide";
        secFor = "nick-color";
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "action=nicknamecolor&color="+jsSelectedColor+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    }
}
function showNickColorSuccess(){

    //alert(document.frmNickColorSel.nick_color.value);
    /*document.getElementById('nickcolorsel').className='hide';
    document.getElementById('success').className='show';
    document.getElementById('success-header').innerHTML="Change Nickname Color";
    document.getElementById('success-msg').innerHTML="Success! Your nickname color is changed.";*/

    /*var jsRGBColor = document.frmNickColorSel.nick_color.value;
    jsRGBColor = "rgb("+jsRGBColor.substring(0,3)+","+jsRGBColor.substring(3,6)+","+jsRGBColor.substring(6,9)+")";
    document.getElementById("nickcolor").style.color = jsRGBColor;*/

    secFor = "nick-color";
    closeWindow();
}
function showNickColorError(errmsg){
    document.getElementById("nickcolorsel-error").innerHTML = errmsg;
    document.getElementById("nickcolorsel-error").className = "error show";
}
function showIcons(jsIcon, jsIconImgPath) {
    hideOtherBoxes("iconsel");
    if(jsIcon=="noicon") document.getElementById("icon_appear").src = "/mpt3images/vgifts/noicon.png";
    else document.getElementById("icon_appear").src = jsIconImgPath;
    document.getElementById("iconsel-error").className= "error hide";
}
function iconSelected() {
    //alert("selectedIcon: "+document.frmIconSelect.icon_selected.value);
    document.getElementById("iconsel-error").className = "error hide";

}
function changeIcon(jsCurrentIcon) {
    var jsSelectedIcon = document.frmIconSelect.icon_selected.value;
    //alert(jsCurrentIcon+","+jsSelectedIcon);
    if(jsCurrentIcon==jsSelectedIcon) {
        document.getElementById("iconsel-error").innerHTML = "You haven't changed your Icon";
        document.getElementById("iconsel-error").className = "error show";
        secFor = "sec";
    } else {
        document.getElementById("iconsel-error").className = "error hide";
        secFor = "icon";
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "action=icon&icon="+jsSelectedIcon+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    }
}
function showIconSuccess(){
    secFor = "icon";
    closeWindow();
}
function showIconError(errmsg){
    document.getElementById("iconsel-error").innerHTML = errmsg;
    document.getElementById("iconsel-error").className = "error show";
}
function hideOtherBoxes(jsVal) {
    console.log(jsVal);
    var lightBoxes = ["security", "change-pass", "change-email", "everify", "adult-opt", "nick-sec", "vidwall",
        "anonview-opt", "oauth", "groupsimin", "groupsifollow", "em-sqsa", "nickcolorsel", "iconsel", "success",
        "mobile-notifications", "download_modal", "credits_autorecharge","royaltysup-opt"];

    for (var i = 0; i < lightBoxes.length; i++) {
        if(document.getElementById(lightBoxes[i])!=null && lightBoxes[i]!=jsVal) {
            document.getElementById(lightBoxes[i]).className='hide';
        }
    }

    hideEverify();
    hideSecurity();

    if(jsVal!=lightBoxes[0] && jsVal!=lightBoxes[3] ){
        if(jsVal!="reset") {
            document.getElementById('thickbox').className='show';
            document.getElementById('tb-window').className='show';
            document.getElementById(jsVal).className='show';
        } else {
            document.getElementById('thickbox').className='hide';
            document.getElementById('tb-window').className='hide';
        }
    } else if(jsVal=== lightBoxes[0]){
        console.log("else if showSecurity",jsVal);
        showSecurity();
    } else if(jsVal=== lightBoxes[3]){
        console.log("else if 1 showSecurity",jsVal);
        showEverify(false);
    }
}
function show_download_modal() {
    if(!localStorage.hasOwnProperty("download_modal")) {
        secFor = "download_modal";
        hideOtherBoxes("download_modal");
        $("#tb-window .tb-dialog .tb-content .tb-container").css("max-width", "420px");
        $("#tb-window .tb-dialog .tb-content .tb-container .close").css("display","none");
        localStorage.setItem("download_modal",false);
    }
}
function stateChanged(){
    if(checkReadyState(xmlHttp)){
        var responseVal = xmlHttp.responseText;
        //alert("responseVal: "+responseVal+", secFor: "+secFor);

        webToken.set('');
        if(responseVal.indexOf('|') !== -1) {
            webToken.set(responseVal.split('|')[1]);
            responseVal = (responseVal.split('|')[0]);
        }

        if(responseVal.trim() == "success" || responseVal.trim().indexOf("success")>=0) {
            if(secFor=="sec-pass") showPassword();
            else if(secFor=="sec-email") showEmail();
            else if(secFor=="change-pass") showPassSuccess();
            else if(secFor=="change-email") showEmailSuccess();
            else if(secFor=="verify-email") showVEmSuccess();
            else if(secFor=="resend-code") showResendSuccess();
            else if(secFor=="adop") showAdultOpSuccess();
            else if(secFor=="sec-nicksec") showNickSec();
            else if(secFor=="change-nicksec") showNickSecSuccess();
            else if(secFor=="vidwall-show") showVideoWallForm(responseVal.trim().substring(7,8));
            else if(secFor=="vidwall-change") showVideoWallSuccess(responseVal.trim().substring(7,8));
            else if(secFor=="anvi") showAnonViewOpSuccess();
            else if(secFor=="royaltysup") showRoyaltySupSuccess();
            else if(secFor=="grpimin") showGroupsImInSuccess();
            else if(secFor=="grpifollow") showGroupsIFollowSuccess();
            else if(secFor=="new-sqsa") {
                secFor="";
                var altgurl = "";
                if(altgt=="Photos" || altgt=="CreateRoom" || altgt=="EditProfile") {
                    altgurl = "/mpt/ControllerServlet?RequestId=MyPalTalk."+altgt;
                    location.href = altgurl;
                }
                /*else if (download_modal) {
                    show_download_modal();
                }*/
                else location.href = location.href;
            }
            else if(secFor=="disc-oauth") {
                secFor="";
                showDisconnectSuccess();
            }
            else if(secFor=="em-sqsa" || secFor=="em-new") showEmSqSaSuccess();
            else if(secFor=="new-email") showEmSqSa();
            else if(secFor=="nick-color") showNickColorSuccess();
            else if(secFor=="icon") showIconSuccess();
            else if(secFor=="edit-email")showEverify(true);
            else if(secFor === "mobile-notifications") showLiveNotificationSuccess();
            else if(secFor=="ar_optin_change") {
                if(optindb==1) {
                    optindb=0;
                    console.log("optindb changed to "+optindb);
                    secFor = "sec";
                    //closeWindow();
                    $("#car_buttons").removeClass("show").addClass("hide");
                    $("#car_processing").removeClass("hide").addClass("show").html("You have opted out of auto-recharge credits.").css({"color":"#039933", "font-weight":"bold"});
                } else if(optindb==0) {
                    optindb=1;
                    //location.reload();
                    $("#car_buttons").removeClass("show").addClass("hide");
                    $("#car_processing").removeClass("hide").addClass("show").html("You have opted in to auto-recharge credits.").css({"color":"#039933", "font-weight":"bold"});
                    secFor="ar_optin_change_refresh";
                }
            }
            else alert("Contact Paltalk Support s-"+secFor);
        } else {
            if(secFor=="sec-pass" || secFor=="sec-email" || secFor=="sec-nicksec" || secFor=="new-sqsa" || secFor=="new-email") showSecError(responseVal);
            else if(secFor=="change-pass") showPassError(responseVal);
            else if(secFor=="change-email") showEmailError(responseVal);
            else if(secFor=="verify-email") showVEmError(responseVal);
            else if(secFor=="resend-code") showResendError(responseVal);
            else if(secFor=="adop") showAdultOpError(responseVal);
            else if(secFor=="change-nicksec") showNickSecError(responseVal);
            else if(secFor=="disc-oauth") showDisconnectError(responseVal);
            else if(secFor=="vidwall-show") showVideoWallError("show", responseVal);
            else if(secFor=="vidwall-change") showVideoWallError("change", responseVal);
            else if(secFor=="anvi") showAnonViewOpError(responseVal);
            else if(secFor=="royaltysup") showRoyaltySupError(responseVal);
            else if(secFor=="grpimin") showGroupsImInError(responseVal);
            else if(secFor=="grpifollow") showGroupsIFollowError(responseVal);
            else if(secFor=="nick-color") showNickColorError(responseVal);
            else if(secFor=="icon") showIconError(responseVal);
            else if(secFor=="em-sqsa" || secFor=="em-new") showEmSqSaError(responseVal);
            else if(secFor=="edit-email") showEditEmailError(responseVal);
            else if(secFor === "mobile-notifications") showLiveNotificationError();
            else if(secFor=="ar_optin_change") {
                $("span.slider").click(function (event) {
                    //dialog(this);
                    event.preventDefault();
                    event.stopPropagation();
                }).css("cursor","default");

                $("label.switch").after("<div id='ar_optin_error' style='color:#FF0000;font-weight:normal'>"+responseVal+"</div>");
                //$("#ar_optin_error").html(responseVal).css("color","#FF0000").css("font-weight","normal");
            }
            else if(secFor=="session-expired") { //if user continues to enter sq, sa after warning
                alert("Security authentication failed. You will be logged out!");
                closeWindow();
            } else {
                alert("Contact Paltalk Support e-"+secFor);
            }
        }
    }
}

function closeWindow() {
    //alert(secFor);
    //if(secFor=="new-sqsa") return;
    document.frmSqSa.reset();
    document.frmChangeEmail.reset();
    document.frmChangePass.reset();

    //alert("secFor: "+secFor+", secQ: "+secQ+", emailAdd: "+emailAddr);

    if(secFor == "disc-oauth-success" || secFor =="em-sqsa-success" || secFor == "nick-color"  || secFor == "icon" || secFor == "royaltysup-success"
        /*|| secFor == "download_modal" || secFor=="vidwall-success" || secFor=="anvi"*/) {
        secFor = "sec";
        location.reload();
    } else if(secFor == "session-expired" || secFor=="new-sqsa" || secFor=="success-pass" || secFor=="success-email") {
        secFor = "sec"; //reset to default value
        //document.formlogout.submit();
        submitLogOut();
    } else if(secFor=="success-nicksec") {
        secFor = "sec"; //reset to default value
        location.href="/mpt/ControllerServlet?RequestId=MyPalTalk.ShowLogin"; //refresh page to show new email
    } /*else if(secFor=="success-email") {
		//do nothing - don't remove this
	} */else if(secFor=="vem-success") {
        secFor = "sec";
        location.href = newCreateGrpURL;
    } else if(secFor=="em-sqsa" && secQ==0 && emailAddr.trim().length==0) {
        secFor = "sec"; //reset to default value
        submitLogOut();
    } else if(secFor=="new-email" && emailAddr.trim().length==0) {
        secFor = "sec"; //reset to default value
        submitLogOut();
    } else if(secFor=="ar_optin_change"){
        secFor = "sec";
        if(optindb==1) {
            $("#autorecharge_optin").prop("checked", true);
            $("#autorecharge_optin").prop("value", "1");
        } else {
            $("#autorecharge_optin").prop("checked", false);
            $("#autorecharge_optin").prop("value", "0");
        }
    } else if(secFor=="ar_optin_change_refresh"){
        secFor = "sec";
        location.reload();
    } else {
        secFor = "sec"; //reset to default value
    }

    if(secFor=="success-email" || secFor=="change-user-email") {
        $("#verem").show();
        $("#verem").addClass("inline");
        hideOtherBoxes("reset");
        location.reload();
    }
    else hideOtherBoxes("reset");//reset windows
}
function GetXmlHttpObject() {
    var xmlHttp=null;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp=new XMLHttpRequest();
    } catch (e) {
        // Internet Explorer
        try {xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");}
        catch (e){xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");}
    }
    return xmlHttp;
}
function checkReadyState(obj){
    if(obj.readyState == 0) { }
    if(obj.readyState == 1) {}
    if(obj.readyState == 2) {}
    if(obj.readyState == 3) { }
    if(obj.readyState == 4){
        if(obj.status == 200){
            return true;
        }
    }
}
function submitLogOut(){
    jQuery("#formlogout").submit();
}
function google_ads() {
    document.getElementById("div-gpt-ad-1386188475411-0").style.width="300px";
    document.getElementById("div-gpt-ad-1386188475411-0").style.height="250px";
    //document.getElementById("div-gpt-ad-1386188475411-0").innerHTML = "<script type='text/javascript'>googletag.cmd.push(function(){ googletag.display('div-gpt-ad-1386188475411-0'); });</ script>";
}
var docCookies = {
    getItem: function (sKey) {
        if (!sKey || !this.hasItem(sKey)) { return null; }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
        //var sExpires = ";expires=Tue, 1 Jan 2013 00:00:00 GMT;";
        document.cookie = escape(sKey) + "=" + escape(sValue) + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    },
    removeItem: function (sKey, sPath) {
        if (!sKey || !this.hasItem(sKey)) { return; }
        document.cookie = escape(sKey) + "=; expires=Tue, 1 Jan 2013 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
    },
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
        return aKeys;
    }
};
function rotateHAds() {
    var adc = docCookies.getItem("myaccount_inads");
    if(adc==null || adc.trim().length==0 || isNaN(adc) || adc==0) {
        docCookies.setItem("myaccount_inads",2,"","/","commerce.paltalk.com",false);
    } else {
        if(adc%4===0) {
            docCookies.setItem("myaccount_inads",1,"","/","commerce.paltalk.com",false);
            return '<a href="https://www.firstmet.com/?xreq_source=eJyLVqqOUUpMic9MiVGyMjc1Na9V0lEyMtONNMzM9AwJyvc3NYgviPf0d7ZIz8lLdjNRigUAdBAOxg&subid=300x250" target="_blank" title="FirstMet"><img src="/mpt4images/FirstMet-ad-300x250.jpg" width="300px" height="250px" border="0"/></a>';
        } else {
            adc++;
            docCookies.setItem("myaccount_inads",adc,"","/","commerce.paltalk.com",false);
        }
    }
    return '<a href="/mpt/ControllerServlet?RequestId=MyPalTalk.PalPlusSubscription&ref=wvmmpt" target="_blank" title="Upgrade Today"><img src="https://www.palassets.com/paltalkads/wvm_house_ad.png" width="300px" height="250px" border="0"/></a>';
}


function showBackDrop(){
    $("#modal-backdrop").removeClass("hide");
    $(".modal").removeClass("hide");
}


function hideBackdrop(){
    $("#modal-backdrop").addClass("hide");
    $(".modal").addClass("hide");
}

function showEverify(emailState){
    resetEmailVerifyModal();
    showBackDrop();
    resetSecurity();
    $("#security").addClass("hide");
    $("#everify").removeClass("hide");
    $("#everify").addClass("modal-container");
    $("input[name=user-email]").prop("disabled",!emailState);
    if(emailState){
        $(".icon-edit").addClass("hide");
        $("input[name=user-email]").removeClass("edit-text");
    }
    findHeight();
}

function hideEverify(){
    hideBackdrop();
    $("#everify").addClass("hide");
}

function showSecurity(){
    resetSecurity();
    showBackDrop();
    setPresetQuestion(secQ);
    $("#security").removeClass("hide");
    $("#security").addClass("modal-container");
    //$(".valueHolder").text("Please wait..");
    //setPresetQuestion(secQ);
}

function hideSecurity(){
    hideBackdrop();
    $("#everify").addClass("hide");
}

function showThickbox(){
    document.getElementById('thickbox').className='show';
    document.getElementById('tb-window').className='show';
}

function resetSecurity(){
    $("#sqsa-error").text("");
    $("#sqsa-error").removeClass("error-msg");
    $("input[name=sa]").val("")
}

function callSecErrorMsg(errMsg){
    $("#sqsa-error").text(errMsg);
    $("#sqsa-error").addClass("error-msg");
    $("#sqsa-error").removeClass("hide");
}

var WebToken = (function () {
    function WebToken() {
    }

    WebToken.prototype.set = function (token) {
        $('#web-token').val(token);
    };
    WebToken.prototype.get = function () {
        return encodeURIComponent($('#web-token').val());
    };
    return WebToken;
}());

var webToken = new WebToken();

//Mobile Live Notifications -- starts here
function showMblLiveNotifiModal() {
    hideOtherBoxes("mobile-notifications");
}

function showLiveNotificationSuccess() {
    hideOtherBoxes("success");
    document.getElementById('success-header').innerHTML = "Mobile Live Notifications Settings Changed";
    document.getElementById('success-msg').innerHTML = " Your Mobile Live Notifications Settings saved successfully";
    secFor = "mobile-notifications";
}

function changeLiveNotifications() {
    secFor = "mobile-notifications";
    var send = document.frmMobileLiveNotifications.liveNotificationsSend[0].checked ? "Y" : "N";
    var receive = document.frmMobileLiveNotifications.liveNotificationsReceive[0].checked ? "Y" : "N";
    console.log("liveNotificationsSend", send);
    console.log("liveNotificationsReceive", receive);
    if (liveNotificationsSend != send || liveNotificationsReceive != receive) {
        liveNotificationsSend = send;
        liveNotificationsReceive = receive;
        liveNotificationSettings(send, receive);
    } else {
        alert("You haven't changed the setting");
        secFor = "sec";
    }
}

function optinChanged() {
    secFor="ar_optin_change";
    $("#ar_optin_error").html("");
    $("#car_processing").removeClass("show").addClass("hide").html("Processing your request...").css({"color":"#000000", "font-weight":"normal"});
    $("#car_buttons").removeClass("hide").addClass("show");
    var optinform = 0;
    if($("#autorecharge_optin").is(":checked")) {
        //$("#autorecharge_optin").val("1");
        optinform = 1;
    } else {
        //$("#autorecharge_optin").val("0");
        optinform = 0;
    }

    if(optindb!=optinform && (optindb==1||optindb==0)) {
        //$("#credits_autorecharge").removeClass("hide").addClass("show");
        if(optinform==1) {
            hideOtherBoxes("credits_autorecharge");
        } else {
            saveOptinChange("0");
        }
    } else {
    }
}

function optin_recharge(optinVal) {
    if(optinVal=="1") {
        saveOptinChange("1");
    } else {
        closeWindow();
        $("#autorecharge_optin").prop("checked", false);
        $("#autorecharge_optin").prop("value", "0");
    }
}

function saveOptinChange(optinform) {
    secFor="ar_optin_change";
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
    xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("POST",url,true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "&action=croptin&optin="+optinform+"&pwoft="+webToken.get();
    xmlHttp.send(params);
    $("#car_buttons").removeClass("show").addClass("hide");
    $("#car_processing").removeClass("hide").addClass("show");
}

/*

function optinChanged(optindb) {
    secFor="ar_optin_change";
    $("#ar_optin_error").html("");
    optindb = parseInt(optindb);
    var optinform = optindb;
    if($("#autorecharge_optin").is(":checked")) {
        //$("#autorecharge_optin").val("1");
        optinform = 1;
    } else {
        //$("#autorecharge_optin").val("0");
        optinform = 0;
    }

    if(optindb!=optinform && (optindb==1||optindb==0) && (optinform==1||optinform==0)) {
        xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("Your browser does not support AJAX!");
            return;
        }
        var url="/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
        xmlHttp.onreadystatechange=stateChanged;
        xmlHttp.open("POST",url,true);
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "&action=croptin&optin="+optinform+"&pwoft="+webToken.get();
        xmlHttp.send(params);
    } else {
    }
}
 */

function liveNotificationSettings(send, receive) {
    xmlHttp = GetXmlHttpObject();
    if (xmlHttp == null) {
        alert("Your browser does not support AJAX!");
        return;
    }
    var url = "/mpt/ControllerServlet?RequestId=MyPalTalk.UserSetting";
    xmlHttp.onreadystatechange = stateChanged;
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = "&action=mobileLiveSettings&send=" + send + "&receive=" + receive + "&pwoft=" + webToken.get();
    xmlHttp.send(params);
}

function showLiveNotificationError() {
    document.getElementById('thickbox').className = 'show';
    document.getElementById('tb-window').className = 'show';
    document.getElementById('success').className = 'hide';
    document.getElementById('mobile-notifications').className = 'show';
    document.getElementById("mobile-notifications-error").className = "error show";
    document.getElementById("mobile-notifications-error").style = "margin-bottom:5px";
    document.getElementById("mobile-notifications-error").innerHTML = "Sorry we are unable to process this request. <br> Please refresh this page and try again or contact paltalk support.";
}
//Mobile Live Notifications -- end here
