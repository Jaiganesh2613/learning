package testing;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.Calendar;
import java.util.Iterator;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Ufields {
    public static int NAME_MIN_LEN=1;
    public static int NAME_MAX_LEN=16;
    public static int NICKNAME_MIN_LEN=5;
    public static int NICKNAME_MAX_LEN=30;
    public static int PASSWORD_MIN_LEN=8;
    public static int PASSWORD_MAX_LEN=25;
    public static int PASSWORD_HINT_MIN_LEN=2;
    public static int PASSWORD_HINT_MAX_LEN=16;
    public static int GROUPNAME_MAX_LEN=50;


    static Pattern emailRegex = Pattern.compile("^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$");

    static Pattern[] patterns = new Pattern[]
            {
                    Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("</script>", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("style\\s*=\\s*['\"]?(.*?)['\"]?", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("console\\.log", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("onload=(.*?)", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("onmouseover=(.*?)", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("onfocus=(.*?)", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("autofocus=(.*?)", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("document.cookie", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("\\'+(.*?)\\+'", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("\\\"(.*?)\\+\"", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("\\bwindow\\.(alert|confirm|prompt|eval|location|open|setTimeout|setInterval|document\\.write|document\\.writeln|Function|execScript|postMessage|onerror|frames|parent)\\b\\(", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("prompt\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("confirm\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("alert\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("(\\b)(on\\S+)(\\s*)=|javascript|<(|\\/|[^\\/>][^>]+|\\/[^>][^>]+)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
                    Pattern.compile("<(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),

                    Pattern.compile("document.location", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("location.href", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("Content-Security-Policy:\\s*(?<csp>.+?)(?=;?$)", Pattern.DOTALL),
                    Pattern.compile("(?<directive>\\w+-src)\\s+(?<sources>[^;]+);"),
                    Pattern.compile("<\\s*script.*?>.*?<\\s*/\\s*script\\s*>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL),
                    Pattern.compile("on\\w+\\s*=\\s*[\"'].*?[\"']", Pattern.CASE_INSENSITIVE | Pattern.DOTALL),
                    Pattern.compile("(javascript|data):.*?", Pattern.CASE_INSENSITIVE | Pattern.DOTALL),
                    Pattern.compile("&#\\d{2,5};", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("(eval|alert|prompt|confirm|document\\.cookie|window\\.location|setTimeout|setInterval)\\s*\\(.*?\\)", Pattern.CASE_INSENSITIVE | Pattern.DOTALL),
                    Pattern.compile("\\(\\)", Pattern.CASE_INSENSITIVE),
            };

    //  *****************************************************************************
//  Validates a group name.  Return null if name is valid, else it returns the
//  the reason why the name is invalid
//  *****************************************************************************
    public static String invalid_group_name(String name, short language_code, boolean group_is_premium) {
        int spaces = 0;

        if (name == null) {
            return "Name is null";
        }

        // we lowercase this so that xxx and xXx are equal in the eyes of this routine
        char[] c  = name.toLowerCase().toCharArray();
        char   ci = 0;

        // next two checks are probalby unnecessary cause they should be checked on the client side
        if ((c.length < 5) || (c.length > 50)) {
            return "Must be from 5 to 50 characters in length";
        }

        if (name.startsWith(" ") || name.endsWith(" ")) {
            return "Cannot start or end with a space";
        }

        // loop thru the char array
        for (int i = 0; i < c.length; i++) {
            ci = c[i];

            // check for a char repeating more then 3 times
            if (i + 3 < c.length) {
                if ((ci == c[i + 1]) && (ci == c[i + 2]) && (ci == c[i + 3])) {
                    return "Too many repeating characters at position: " + i + " char: " + ci;
                }
            }

            // check for 2 spaces next to each other
            if (i + 1 < c.length) {
                if ((ci == ' ') && (c[i + 1] == ' ')) {
                    return "Consecutive spaces: " + i + " char: " + ci;
                }
            }

            if (i + 6 < c.length) {
                if ((ci == ' ') && (c[i + 2] == ' ') && (c[i + 4] == ' ') && (c[i + 6] == ' ')) {
                    return "Improper use of spaces at position: " + i;
                }
            }

            // check for 2 char repeating patterns (xyxyxy Samuelson)
            if (i + 5 < c.length) {
                char di = c[i + 1];

                if ((ci == c[i + 2]) && (ci == c[i + 4]) && (di == c[i + 3]) && (di == c[i + 5])) {
                    return "Repeating patterns not allowed: " + i + " pattern: " + ci + di;
                }
            }

            // check for 3 char repeating patterns (abcabcabc George)
            if (i + 8 < c.length) {
                char di = c[i + 1];
                char ei = c[i + 2];

                if ((ci == c[i + 3]) && (ci == c[i + 6]) && (di == c[i + 4]) && (di == c[i + 7]) && (ei == c[i + 5])
                        && (ei == c[i + 8])) {
                    return "Repeating patterns not allowed: " + i + " pattern: " + ci + di + ei;
                }
            }

            // check for 4 char repeating patterns (abcdabcd Mary)
            if (i + 7 < c.length) {
                if ((ci == c[i + 4]) && (c[i + 1] == c[i + 5]) && (c[i + 2] == c[i + 6]) && (c[i + 3] == c[i + 7])) {
                    return "Repeating patterns not allowed: " + i + " pattern: " + ci + c[i + 1] + c[i + 2] + c[i + 3];
                }
            }

            // check for 5 char repeating patterns (abcdeabcde Mary)
            if (i + 9 < c.length) {
                if ((ci == c[i + 5]) && (c[i + 1] == c[i + 6]) && (c[i + 2] == c[i + 7]) && (c[i + 3] == c[i + 8])
                        && (c[i + 4] == c[i + 9])) {
                    return "Repeating patterns not allowed: " + i + " pattern: " + ci + c[i + 1] + c[i + 2] + c[i + 3]
                            + c[i + 4];
                }
            }

            // keep track of how many total spaces there are
            if (ci == ' ') {
                spaces++;
            }

            // make sure its a valid char
            if ((language_code == 21) && group_is_premium)    // arabic
            {
                if (((ci >= 'a') && (ci <= 'z')) || ((ci >= 'A') && (ci <= 'Z')) || ((ci >= '0') && (ci <= '9'))
                        || ((ci >= 192) && (ci <= 255) && (ci != 200)) || (ci == ' ')) {
                    continue;
                } else {
                    return "Invalid character found at position: " + i + " char: " + ci;
                }
            } else {
                if (((ci >= 'a') && (ci <= 'z')) || ((ci >= 'A') && (ci <= 'Z')) || ((ci >= '0') && (ci <= '9'))
                        || (ci == ' ')) {
                    continue;
                } else {
                    return "Invalid character found at position: " + i + " char: " + ci;
                }
            }
        }    // for

        // check for too many spaces
        if (spaces > 7) {
            return "Too many spaces";
        }

        // its all good so return null
        return null;
    }

    //  *****************************
    public static boolean chkSQLInj(String s) {

        // check against list of possibile sql inject chars
        if (s == null) {
            return false;
        }

        String   sl     = s.toLowerCase();
        String[] sarray = {
                ";", "--", "drop ", "delete ", "update ", "insert ", "truncate ", "select ", "sp_", ",", "char("
        };

        for (int i = 0; i < sarray.length; i++) {
            if (sl.indexOf(sarray[i]) != -1) {
                return true;
            }
        }

        return false;
    }

//  ***************************************************************************
//

    //  ***************************************************************************
    public static String quote(String s) {
        if (s == null) {
            return s;
        }

        if (s.indexOf("char(") != -1) {

            throw new RuntimeException("invalid fodder - 218support");
        }

        return "'" + ssquote(s.trim()) + "'";
    }

//  ***************************************************************************
//

    //  ***************************************************************************
    public static String ssquote(String s1) {
        char   c;
        int    j    = 0;
        int    next = 0,
                i    = 0;
        String s2   = "";

        while (true) {
            i = s1.indexOf("'", next);

            if ((i == -1) && (next == 0)) {
                return s1;
            }

            if (i == -1) {
                s2 = s2 + s1.substring(next);

                return s2;
            }

            s2   = s2 + s1.substring(next, i) + "''";
            next = i + 1;
        }
    }



    public static boolean invalid_name_size(String s)
    {

        // check size
        if ((s.length() < NAME_MIN_LEN) || (s.length() > NAME_MAX_LEN))
        {
            return true;
        }

        return false;
    }

    public static boolean invalid_nickname_size(String s)
    {

        // check size
        if ((s.length() < NICKNAME_MIN_LEN) || (s.length() > NICKNAME_MAX_LEN))
        {
            return true;
        }

        return false;
    }



    public static boolean invalid_password_size(String s)
    {

        // check size
        // if(s.length() < 5 || s.length() > 16) return true;
        if ((s.length() < PASSWORD_MIN_LEN) || (s.length() > PASSWORD_MAX_LEN))
        {
            return true;
        }

        return false;
    }

    public static boolean invalid_password_hint_size(String s)
    {

        // check size
        if ((s.length() < PASSWORD_HINT_MIN_LEN) || (s.length() > PASSWORD_HINT_MAX_LEN))
        {
            return true;
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean unethical_nickname(String s) {
        String x = " " + s.toLowerCase() + " ";

        if ((((x.indexOf("pal") >= 0) || (x.indexOf("pai") >= 0) || (x.indexOf("pa1") >= 0))
                && ((x.indexOf("talk") >= 0) || (x.indexOf("taik") >= 0)
                || (x.indexOf("ta1k") >= 0))) || ((x.indexOf("pal") >= 0) && (x.indexOf("palom") == -1))
                || (x.indexOf("paihe") >= 0) || (x.indexOf("heip") >= 0) || (x.indexOf("help") >= 0)
                || (x.indexOf("secur") >= 0) || (x.indexOf("support") >= 0) || (x.indexOf("system") >= 0)
                || (x.indexOf("admin") >= 0) || (x.indexOf("police") >= 0) || (x.indexOf("adm ") >= 0)
                || ((x.indexOf("pai") >= 0) && ((s.indexOf("aI") >= 0) || (s.indexOf("AI") >= 0)))) {
            return true;
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean prohibited_nickname(String s) {
        boolean remove_connectors = true;
        String  x                 = retool_nickname(s, remove_connectors).toLowerCase();

        if ((x.indexOf("manager") >= 0) || (x.indexOf("not*f*er") >= 0) || (x.indexOf("account") >= 0)
                || (x.indexOf("n*ckname") >= 0) || (x.indexOf("b****ng") >= 0) || (    // block variations of billing
                x.indexOf("b***ng") >= 0) || (                                                   // block variations of billing
                x.indexOf("secur*ty") >= 0) || (x.indexOf("commerce") >= 0) || (x.indexOf("bus*ness") >= 0)
                || (x.indexOf("contro**er") >= 0) || (x.indexOf("contro*er") >= 0) || (x.indexOf("customer") >= 0)
                || (x.indexOf("serv*ce") >= 0) || (x.indexOf("adm*n") >= 0) || (x.indexOf("pa*host") >= 0)
                || (x.indexOf("pa*supp") >= 0) || (x.indexOf("pa*he*p") >= 0) || (x.indexOf("pa*ta*k") >= 0)
                || (x.indexOf("pata*k") >= 0) || (x.indexOf("pta*k") >= 0) || (x.indexOf("system") >= 0)
                || (x.indexOf("*centra*stat*on") >= 0) || (x.indexOf("po**ce") >= 0) || (    // block variations of police
                x.indexOf("padee*") >= 0) || (      // block variations of padeel
                x.indexOf("p*dee*") >= 0)) {    // block variations of padeel
            return true;
        }

        x = retool_nickname(s, !remove_connectors).toLowerCase();

        if ((x.indexOf("-*cs-") >= 0) || (         // block variations of ICS surrounded by connectors
                x.indexOf("-host-") >= 0) || (     // block variations of host surrounded by connectors
                x.indexOf("-pa*-") >= 0)) {    // block variations of pal surrounded by connectors
            return true;
        }

        return false;
    }

    //  *****************************************************************************
//   Reduces a name down to a format that is more easily compared against for
//   illeagl nicks.
//   If remove_connectors is on then eliminates spaces and makes anything that looks like an L or an I into a *
//   If remove_connectors is off then adds a dash to start and end and converts all connectors to dashes
//   Example   adm1n k-i-n-g would convert to
//   adm*nk*ng         remove_connectors on
//   -adm*n-k-*-n-g-   remove_connectors off
//  *****************************************************************************
    public static String retool_nickname(String nickname, boolean remove_connectors) {
        char[]        cs = nickname.toCharArray();
        char          c  = ' ';
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < cs.length; i++) {
            c = cs[i];

            if ((c == ' ') || (c == '-') || (c == '_')) {
                if (remove_connectors) {
                    continue;
                } else {
                    sb.append('-');
                }
            }

            if ((c == 'i') || (c == 'I') || (c == 'l') || (c == 'L') || (c == '1')) {
                sb.append('*');
            } else {
                sb.append(c);
            }
        }

        if (remove_connectors) {
            return sb.toString();
        } else {
            return "-" + sb.toString() + "-";
        }
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean invalid_chars_in_nickname(String s) {
        char[] c         = s.toCharArray();
        char   ci        = 0,
                last_ci   = 0,
                last      = 0;
        int    sep       = 0,
                repeater  = 0,
                iDigitCnt = 0;

        if ((c.length < 2) || (c.length > 25)) {
            return true;    // cannot be less than 2 chars or > 25
        }

        if ((c[0] == ' ') || (c[0] == '-') || (c[0] == '_')) {
            return true;
        }

        if (s.endsWith(" ")) {
            return true;    // cannot end with a space
        }

        for (int i = 0; i < c.length; i++) {
            ci = c[i];

            if ((ci >= 1) && (ci <= 31)) {
                return true;    // disallow Control Characters.
            }

            if (ci > 127) {
                return true;    // disallow the weird chars in a nickname
            }

            if (ci == last) {
                if (++repeater > 3) {
                    return true;
                } else {
                    ;           // if one char repeats more than 3 times
                }
            } else {
                repeater = 0;
                last     = ci;
            }

//          if (i > 0 && ci == 'I')
//              if (last_ci != ' ' && last_ci != '_' || last_ci != '-')
//                  if (Character.isUpperCase(last_ci))
//                      return true; //cap I in the middle

            if (Character.isDigit(ci)) {
                iDigitCnt++;
            }

            if (iDigitCnt > 6) {
                return true;    // nickname should contain no more than 6 numeric digits in total anywhere in the name
            }

            if ((ci == ' ') && (last_ci == ' ')) {
                return true;    // two consecutive spaces
            }

            if ((ci == '_') && ((last_ci == '_') || (last_ci == '-'))) {
                return true;    // two consecutive underbars
            }

            if ((ci == '-') && ((last_ci == '_') || (last_ci == '-'))) {
                return true;    // two consecutive dashes
            }

            if ((ci == '_') || (ci == '-') || (ci == ' ')) {
                sep++;
            }

            if (is_letter(ci) || Character.isDigit(ci) || (ci == '_') || (ci == '-') || (ci == ' ')) {
                last_ci = ci;
            } else {
                return true;
            }
        }

        if (sep > 4) {
            return true;    // a max of 4 separator characters may be used in a name
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean invalid_one_in_nickname(String s) {
        char[] c       = s.toCharArray();
        char   ci      = 0,
                prev_ci = 0,
                next_ci = 0;

        for (int i = 0; i < c.length; i++) {
            ci = c[i];

            // check for a one preceeded and followed by a letter like: Adm1n
            if (ci == '1')    // one
            {
                if (i > 0) {
                    prev_ci = c[i - 1];
                } else {
                    prev_ci = '-';
                }

                if (i + 1 < c.length) {
                    next_ci = c[i + 1];
                } else {
                    next_ci = '-';
                }

                if (is_letter(prev_ci) && is_letter(next_ci)) {
                    return true;
                }
            }

            // capital I masquerading as a lower case l(arry)
            // check for a capital I preceeded by a lowercase letter as in paItalk
            if (ci == 'I')    // capital I
            {
                if (i > 0) {
                    prev_ci = c[i - 1];
                } else {
                    prev_ci = '-';
                }

                if (i + 1 < c.length) {
                    next_ci = c[i + 1];
                } else {
                    next_ci = '-';
                }

                if ((prev_ci >= 'a') && (prev_ci <= 'z')) {
                    return true;
                }
            }

            // capital I or lower case l(arry) masquerading as a one
            if ((ci == 'I') || (ci == 'l')) {
                if (i > 0) {
                    prev_ci = c[i - 1];
                } else {
                    prev_ci = '-';
                }

                if (i + 1 < c.length) {
                    next_ci = c[i + 1];
                } else {
                    next_ci = '-';
                }

                // check -I  which looks like a dash one by seeing if surronded by sep chars
                // and was at the end like homer_I
                if (is_separator(prev_ci) && is_separator(next_ci) && (i == c.length - 1)) {
                    return true;
                }
            }
        }                     // for

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean nickname_worth_restricting(String s) {
        char[] c  = s.toCharArray();
        char   ci = 0;

        // cannot begin or end with a space
        if (c[0] == ' ') {
            return true;
        }

        if(Character.isDigit(c[0])) {
            return true;
        }

        if (s.endsWith(" ")) {
            return true;
        }

        for (int i = 0; i < c.length; i++) {
            ci = c[i];

            if (ci > 127) {
                return true;    // disallow the weird chars in a nickname
            }

            if (is_letter(ci) || Character.isDigit(ci) || (ci == '_') || (ci == '-') || (ci == ' ')) {
                ;               //
            } else {
                return true;
            }
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean offensive_nickname(String s) {
        String x = s.toLowerCase();

        if ((x.indexOf("slut") >= 0) || (x.indexOf("penis") >= 0) || (x.indexOf("pecker") >= 0)
                || (x.indexOf("bitch") >= 0) || (x.indexOf("bytch") >= 0) || (x.indexOf("snatch") >= 0)
                || (x.indexOf("pussy ") >= 0) || (x.indexOf("cock") >= 0) || (x.indexOf("c0ck") >= 0)
                || (x.indexOf("naked") >= 0) || (x.indexOf("nude") >= 0) || (x.indexOf("titty") >= 0)
                || (x.indexOf("dick") >= 0) || (x.indexOf("stroke") >= 0) || (x.indexOf("str0ke") >= 0)
                || (x.indexOf("hardon") >= 0) || (x.indexOf("ass ") >= 0) || (x.indexOf("tits") >= 0)
                || (x.indexOf("cum") >= 0) || (x.indexOf("cumm ") >= 0) || (x.indexOf("hooter") >= 0)
                || (x.indexOf("lick") >= 0) || (x.indexOf("gay ") >= 0) || (x.indexOf("crap") >= 0)
                || (x.indexOf("pimp") >= 0) || (x.indexOf(" hell ") >= 0) || (x.indexOf("queer") >= 0)
                || (x.indexOf("shit") >= 0) || (x.indexOf("fuck") >= 0) || (x.indexOf("fuq") >= 0)
                || (x.indexOf(" fuc ") >= 0) || (x.indexOf("fuk") >= 0) || (x.indexOf("fart") >= 0)
                || (x.indexOf("suck") >= 0) || (x.indexOf("damn") >= 0) || (x.indexOf("piss") >= 0)
                || (x.indexOf("boobs") >= 0) || (x.indexOf("clit") >= 0) || (x.indexOf("twat") >= 0)
                || (x.indexOf("beaver") >= 0) || (x.indexOf("schlong") >= 0) || (x.indexOf("shlong") >= 0)
                || (x.indexOf("orgasm") >= 0) || (x.indexOf("stripp") >= 0) || (x.indexOf("horny") >= 0)
                || (x.indexOf("nigga") >= 0) || (x.indexOf("nigger") >= 0) || (x.indexOf("bastard") >= 0)
                || (x.indexOf("testicle") >= 0) || (x.indexOf("lesbian") >= 0) || (x.indexOf("lesbo") >= 0)
                || (x.indexOf("lezbo") >= 0) || (x.indexOf("bastard") >= 0) || (x.indexOf("thick") >= 0)
                || (x.indexOf("cunt") >= 0) || (x.indexOf("vagina") >= 0)) {
            return true;
        }

        int i = x.indexOf("69");

        if (i >= 0) {
            if (x.indexOf("6969") >= 0) {
                return true;
            }

            char[] ca = x.toCharArray();

            if (!Character.isDigit(ca[i - 1]) && x.endsWith("69")) {
                return true;
            }

            if (!Character.isDigit(ca[i - 1]) &&!Character.isDigit(ca[i + 2])) {
                return true;
            }

            if (x.indexOf("069") >= 0) {
                return true;
            }
        }

        if ((x.indexOf("inchs") >= 0) || (x.indexOf("inches") >= 0)) {
            if (x.indexOf("winch") == -1) {
                return true;
            }
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean invalid_name(String name) {
        if (name == null) {
            return true;
        } else {
            name = name.trim();
        }

        if (name.equalsIgnoreCase("paltalk")) {
            return true;
        }

//      int spaces = 0;
        int    periods = 0,
                quotes  = 0,
                dashes  = 0;
        char[] c       = name.toCharArray();
        char   ci      = 0;

        if ((c.length < 1) || (c.length > 16)) {
            return true;    // cannot be less than 1 chars or > 25
        }

        if (c[0] == ' ') {
            return true;    // cannot start with a space
        }

        if (name.endsWith(" ")) {
            return true;    // cannot end with a space
        }

        for (int i = 0; i < c.length;
             i++)            // must be a:z, dash, or quote or period
        {
            ci = c[i];

            if ((ci >= 1) && (ci <= 31)) {
                return true;    // disallow Control Characters.
            }

            if (ci > 127) {
                return true;    // disallow the weird chars
            }

            if (is_letter(ci) || (ci == '-') || (ci == '\'') || (ci == '.')) {

//              if (ci == ' ')
//              {
//                  spaces++;
//                  if (i > 0 && c[i-1] == ' ')
//                      return true;  //2 spaces in a row not allowed
//              }
                if (ci == '.') {
                    periods++;
                }

                if (ci == '\'') {
                    quotes++;
                }

                if (ci == '-') {
                    dashes++;
                }
            } else {
                return true;
            }
        }

//      if (spaces > 2) return true;
        if (periods > 1) {
            return true;
        }

        if (quotes > 1) {
            return true;
        }

        if (dashes > 1) {
            return true;
        }

        return false;
    }

    /** ********************************************************************** */
    public static boolean invalid_birthday(String mmddyyyy, int minage) {

        // break these apart
        String mm   = mmddyyyy.substring(0, 1);
        String dd   = mmddyyyy.substring(2, 3);
        String yyyy = mmddyyyy.substring(4, 7);

        return invalid_birthday(mm, dd, yyyy, minage);
    }

    /** ********************************************************************** */
    public static boolean invalid_birthday(String mm, String dd, String yyyy, int minage) {

        // check for validity - pass minimum age
        try {

            // month check
            int mon = Integer.parseInt(mm);

            if ((mon < 1) || (mon > 12)) {
                return true;
            }

            // day check
            int day = Integer.parseInt(dd);

            if (day < 1) {
                return true;
            }

            if (((mon == 9) || (mon == 4) || (mon == 6) || (mon == 11)) & day > 30) {
                return true;
            }

            // if ((mon == 2) & (day > 28)) return true;

            if (day > 31) {
                return true;
            }

            // year check
            int year    = Integer.parseInt(yyyy);
            int nowyear = Calendar.getInstance().get(Calendar.YEAR);
            int nowmon  = Calendar.getInstance().get(Calendar.MONTH);
            int nowday  = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);

            if (year < (nowyear - 100)) {
                return true;
            }

            if (year > nowyear) {
                return true;
            }

            if (year > (nowyear - minage)) {
                if (mon > nowmon) {
                    return true;
                }

                if (day > nowday) {
                    return true;
                }
            }

            if (mon == 2) {

                // if((year % 2 == 0) & (day > 29)) return true;
                // if((year % 2 != 0) & (day > 28)) return true;
                if (isLeapYear(year) & day > 29) {
                    return true;
                }

                if (!isLeapYear(year) & day > 28) {
                    return true;
                }
            }
        } catch (java.lang.NumberFormatException e) {
            return true;
        }

        return false;
    }

    /** ********************************************************************** */
    public static boolean isLeapYear(int yr) {
        if (((yr % 4 == 0) && (yr % 100 != 0)) || (yr % 400 == 0)) {
            return true;
        }

        return false;
    }

    /** ********************************************************************** */
    public static boolean invalid_email(String email) {
        try {
            if ((email == null) || (email.length() < 5)) {
                return true;
            }

            if ((email.indexOf('@') < 1) || (email.indexOf('.') == -1)) {
                return true;
            }

            if (email.startsWith("paltalk@")) {
                return true;
            }

            if (email.startsWith("admin@")) {
                return true;
            }

            if (email.startsWith("help@")) {
                return true;
            }

            if (email.startsWith("support@")) {
                return true;
            }

            if (email.startsWith("webmaster@")) {
                return true;
            }

            if (email.startsWith("postmaster@")) {
                return true;
            }

            if (email.startsWith("webhost@")) {
                return true;
            }

            if (email.startsWith("mailhost@")) {
                return true;
            }

            if (email.startsWith("mailserver@")) {
                return true;
            }

            if (email.startsWith("listserv@")) {
                return true;
            }

            if (email.startsWith("webmaster@")) {
                return true;
            }

            if (email.indexOf("@method.") > 0) {
                return true;
            }

            if (email.endsWith("@")) {
                return true;
            }

            if (email.endsWith(".")) {
                return true;
            }

            // if (email.indexOf("@ggfg.com") > 0) return true;
            // if (email.indexOf("@paltalk.") > 0) return true;
            // if (email.indexOf("@corp.paltalk.") > 0) return true;

            String  sAllow = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._@-";
            boolean bValid = true;
            char    ch;
            int     j;
            int     ccnt = 0;

            for (int i = 0; i < email.length(); i++) {
                ch = email.charAt(i);

                if (ch == '@') {
                    ccnt++;
                }

                if (ccnt > 1) {
                    bValid = false;

                    break;
                }

                for (j = 0; j < sAllow.length(); j++) {
                    if (ch == sAllow.charAt(j)) {
                        break;
                    }
                }

                if (j == sAllow.length()) {
                    bValid = false;

                    break;
                }
            }

            if (!bValid) {
                return true;
            }
        } catch (Exception e) {
            return true;
        }

/*        int p = email.indexOf("@pa");
        if (p >= 0)
        {
            int i = email.indexOf("k.");
            if (i >= 0)
            {
                String ss = email.substring(p,i+1);
                if (ss.indexOf("ta") >= 0)
                {
                    if (ss.indexOf("talk") >= 0) return true;
                    if (ss.indexOf("taik") >= 0) return true;
                    if (ss.indexOf("ta1k") >= 0) return true;
                }
            }
        }
*/
        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean isPassInNick(String sNick, String sPass) {
        if ((sNick.toLowerCase().indexOf(sPass.toLowerCase()) >= 0)
                || (sPass.toLowerCase().indexOf(sNick.toLowerCase()) >= 0)) {
            return true;
        } else {
            return false;
        }
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean is_letter(char c) {
        if ((c >= 'a') && (c <= 'z')) {
            return true;
        }

        if ((c >= 'A') && (c <= 'Z')) {
            return true;
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean is_lowercase(char c) {
        if ((c >= 'a') && (c <= 'z')) {
            return true;
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean is_uppercase(char c) {
        if ((c >= 'A') && (c <= 'Z')) {
            return true;
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean is_alphaNumeric(String s) {
        char[] c = s.toCharArray();

        for (int i = 0; i < c.length; i++) {
            if (!is_letter(c[i]) &&!Character.isDigit(c[i])) {
                return false;
            }
        }

        return true;
    }

//  *****************************************************************************
    // // *****************************************************************************
//

    public static boolean is_alphaNumericSpace(String s) {
        char[] c = s.toCharArray();

        for (int i = 0; i < c.length; i++) {
            if (!is_letter(c[i]) && (c[i] != ' ') &&!Character.isDigit(c[i])) {
                return false;
            }
        }

        return true;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static boolean is_separator(char c) {
        if ((c == ' ') || (c == '-') || (c == '_')) {
            return true;
        }

        return false;
    }

//  ****************************************************************************
//

    //  ****************************************************************************
    public static boolean severly_offensive_name(String in) {
        String t = " " + in.toLowerCase() + " ";

        if (phrase_contains_word(t, "fuck") || phrase_contains_word(t, "shit") || (t.indexOf(" cunt ") >= 0)
                || (t.indexOf(" clit") >= 0) || (t.indexOf(" twat") >= 0) || (t.indexOf(" suck ") >= 0)
                || (t.indexOf("jacking") >= 0) || (t.indexOf("jackoff") >= 0) || (t.indexOf("jack off") >= 0)
                || (t.indexOf(" j/o ") >= 0) || (t.indexOf("boner") >= 0) || (t.indexOf("c*ck") >= 0)
                || (t.indexOf("cock") >= 0) || (t.indexOf("c0ck") >= 0) || (t.indexOf(" hung ") >= 0)
                || (t.indexOf("puss") >= 0) || (t.indexOf(" dick") >= 0) || (t.indexOf(" d*ck") >= 0)
                || (t.indexOf("masterb") >= 0) || (t.indexOf("mastrb") >= 0) || (t.indexOf("mastu") >= 0)
                || (t.indexOf("nigger") >= 0) || (t.indexOf("nigga") >= 0) || (t.indexOf("bastard") >= 0)
                || (t.indexOf("asshole") >= 0) || (t.indexOf("feces") >= 0) || (t.indexOf("penis") >= 0)
                || (t.indexOf("strok") >= 0) || (t.indexOf("str0k") >= 0) || (t.indexOf("fetus") >= 0)
                || (t.indexOf(" tits ") >= 0) || (t.indexOf(" boobs ") >= 0) || (t.indexOf(" breasts ") >= 0)
                || (t.indexOf("nigger") >= 0) || (t.indexOf("incest") >= 0) || (t.indexOf("beaver") >= 0)
                || (t.indexOf("beaver") >= 0) || (t.indexOf("gobbb") >= 0) || (t.indexOf(" gobb ") >= 0)
                || (t.indexOf(" k9 ") >= 0) || (t.indexOf(" k-9 ") >= 0)
                || ((t.indexOf("dogg") >= 0) && (t.indexOf("styl") >= 0))
                || ((t.indexOf("animal") >= 0) && (t.indexOf("sex") >= 0)) || (t.indexOf(" get off ") >= 0)
                || (t.indexOf("asshole") >= 0)) {
            return true;
        }

        if ((t.indexOf("pic") >= 0) || (t.indexOf("pix") >= 0) || (t.indexOf("sex ") >= 0)
                || (t.indexOf("video") >= 0)) {
            if ((t.indexOf("young") >= 0) || (t.indexOf("pre") >= 0) || (t.indexOf("teen") >= 0)
                    || (t.indexOf("kiddie") >= 0) || (t.indexOf("daught") >= 0)) {
                return true;
            }
        }

        return false;
    }

//  ****************************************************************************
//

    //  ****************************************************************************
    public static boolean moderatly_offensive_name(String in) {
        String name = " " + in.toLowerCase() + " ";

        if (name.indexOf("damn") >= 0) {
            return true;
        }

        if (name.indexOf("piss") >= 0) {
            return true;
        }

        if (name.indexOf("lden sh") >= 0) {
            return true;
        }

        if (name.indexOf("pimp") >= 0) {
            return true;
        }

        if (name.indexOf("pansy") >= 0) {
            return true;
        }

        if (name.indexOf("jerk") >= 0) {
            return true;
        }

        if (name.indexOf(" fag") >= 0) {
            return true;
        }

        if (name.indexOf(" fuk") >= 0) {
            return true;
        }

        if (name.indexOf(" jerk") >= 0) {
            return true;
        }

        if (name.indexOf("prick") >= 0) {
            return true;
        }

        if (name.indexOf("pecker") >= 0) {
            return true;
        }

        if (name.indexOf("dildo") >= 0) {
            return true;
        }

        if (name.indexOf(" laid") >= 0) {
            return true;
        }

        if (name.indexOf("bitch") >= 0) {
            return true;
        }

        if (name.indexOf(" kum") >= 0) {
            return true;
        }

        if (name.indexOf(" cum ") >= 0) {
            return true;
        }

        if (name.indexOf(" cumm ") >= 0) {
            return true;
        }

        if (name.indexOf(" cum.") >= 0) {
            return true;
        }

        // if (name.indexOf("horn") >= 0) return true;
        if (name.indexOf(" inch") >= 0) {
            return true;
        }

        if (name.indexOf("incest") >= 0) {
            return true;
        }

        if (name.indexOf("pantie") >= 0) {
            return true;
        }

        if (name.indexOf("feces") >= 0) {
            return true;
        }

        if (name.indexOf(" scat") >= 0) {
            return true;
        }

        if (name.indexOf(" rape ") >= 0) {
            return true;
        }

        if (name.indexOf(" rapist") >= 0) {
            return true;
        }

        if (name.indexOf(" kill ") >= 0) {
            return true;
        }

        if (name.indexOf("give head") >= 0) {
            return true;
        }

        if (name.indexOf("giving head") >= 0) {
            return true;
        }

        return false;
    }

//  ****************************************************************************
//

    //  ****************************************************************************
    public static boolean reserved_name(String in) {
        String name = " " + in.toLowerCase() + " ";

        if (((name.indexOf("pal") >= 0) || (name.indexOf("pai") >= 0) || (name.indexOf("pa1") >= 0))
                && ((name.indexOf("talk") >= 0) || (name.indexOf("taik") >= 0) || (name.indexOf("ta1k") >= 0))) {
            return true;
        }

        if (name.indexOf("support") >= 0) {
            return true;
        }

        if (name.indexOf("admin") >= 0) {
            return true;
        }

        if (name.indexOf("admln") >= 0) {
            return true;
        }

        if (name.indexOf("adm1n") >= 0) {
            return true;
        }

        if (name.indexOf("adm ") >= 0) {
            return true;
        }

        if (name.indexOf("adm.") >= 0) {
            return true;
        }

        if (name.indexOf("help")>=0 || name.indexOf("he1p")>=0) {
            return true;
        }

        if (name.indexOf("paltech")>=0 || name.indexOf("pa1tech")>=0) {
            return true;
        }

        return false;
    }

//  ****************************************************************************
//

    //  ****************************************************************************
    public static boolean phrase_contains_word(String msg, String word) {
        char[] ca    = msg.toCharArray();
        char[] wa    = word.toCharArray();
        int    level = 0;
        char   pre   = '*',
                post  = '*';

        for (int i = 0; i < msg.length(); i++) {    // handle trash. It   or  english, it's clear
            if (((ca[i] == '.') || (ca[i] == ',')) && ((i + 1 < msg.length()) && (ca[i + 1] == ' '))) {
                level = 0;
                pre   = '*';
                post  = '*';

                continue;
            }

            if (((level > 0) && (ca[i] == '*')) || (Character.isLetter(ca[i]))) {
                ;                                   // keep going
            } else {
                continue;
            }

            if ((ca[i] == wa[level]) || ((ca[i] == '*') && (level < word.length() - 1))
                    || ((ca[i] == '$') && (wa[level] == 's'))) {
                if ((level == 0) && (i > 0)) {
                    pre = ca[i - 1];
                }

                level++;
            } else if ((level > 0) && (ca[i] == wa[level - 1])) {

                // level = level;
            } else {
                level = 0;
            }

            if (level >= word.length()) {    // handle trash it baby
                if ((i + 1 < msg.length()) && Character.isLetter(pre)
                        && (Character.isLetter(ca[i + 1]) || (ca[i + 1] == ' ') || (ca[i + 1] == '.'))) {
                    level = 0;
                    pre   = '*';
                    post  = '*';

                    continue;
                }

                if (word.equalsIgnoreCase("shit"))    // handle yoshi the door is this way
                {
                    int jjj = msg.indexOf("shi t");

                    if ((jjj >= 0) && (jjj + 5 < msg.length())) {
                        if (Character.isLetter(ca[jjj + 5])) {
                            level = 0;
                            pre   = '*';
                            post  = '*';

                            continue;
                        }
                    }
                }                                     // if

                return true;
            }
        }                                             // for

        return false;
    }    // phrase_contains_word

//  ****************************************************************************
//

    //  ****************************************************************************
    public static boolean caps_or_repeat_problem(String name) {
        char[] ca       = name.toCharArray();
        char   last     = ' ';
        int    caps     = 0;
        int    repeater = 0;

        for (int i = 0; i < name.length(); i++) {
            if (ca[i] == ' ') {
                continue;
            }

            if ((ca[i] >= 'A') && (ca[i] <= 'Z')) {
                caps++;
            }

            if (ca[i] == last) {
                if (++repeater > 2) {
                    return true;
                } else {
                    ;
                }
            } else {
                repeater = 0;
                last     = ca[i];
            }
        }    // for

        if (((caps > 6) && (name.length() < 15)) || (caps > 9)) {
            return true;
        }

        return false;
    }    // caps_or_repeat_problem

//  ****************************************************************************
//

    //  ****************************************************************************
    public static boolean invalid_text(String para) {
        String t = para.toLowerCase();

        if ((t.indexOf("fuck") > 0) || (t.indexOf("fck") > 0) || (t.indexOf("cunt") > 0)
                || ((t.indexOf(" shit") >= 0) && (t.indexOf(" shita") == -1) && (t.indexOf(" shitsu") == -1))
                || (t.indexOf(" fukin ") >= 0) || (t.indexOf(" fuker ") >= 0) || (t.indexOf(" fuk ") >= 0)
                || (t.indexOf(" fuc ") >= 0) || (t.indexOf("phuck") >= 0) || (t.indexOf(" cock ") >= 0)
                || (t.indexOf(" bitch ") >= 0) || (t.indexOf(" tits ") >= 0) || (t.indexOf(" a dick ") >= 0)
                || (t.indexOf(" my dick ") >= 0) || (t.indexOf("faggot") >= 0) || (t.indexOf("nigger") >= 0)
                || (t.indexOf(" nigga") >= 0) || (t.indexOf("a$$hole") >= 0) || (t.indexOf("asshole") >= 0)) {
            return true;
        }

        return false;
    }

    // *****************************************************************************
//  A capital i (ivan) used in place of a lower case l (larry)
//  A 0 (zero) used in place of an O (Oscar)
// *****************************************************************************
    public static boolean using_cloning_tricks(String name) {
        char[] c    = (" " + name + " ").toCharArray();
        char   ci   = 0,
                last = 0;

        for (int i = 0; i < c.length; i++) {
            if (c[i] == 'I') {
                if ((c[i - 1] != ' ') && (c[i - 1] != '-') && (c[i - 1] != '_') && Character.isLowerCase(c[i - 1])) {
                    return true;
                }
            }

            if (c[i] == '0') {
                if (Character.isLetter(c[i + 1])) {
                    return true;
                }
            }
        }

        return false;
    }

//  *****************************************************************************
//

    //  *****************************************************************************
    public static String adjust_for_clones(String name) {
        char[]        c  = name.toCharArray();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < c.length; i++) {

            // uppercase i replace all uppercase Is with lowercase
            if (c[i] == 'I') {
                sb.append('i');

                continue;
            }

            // lowercase L
            // if nick starts with lowercase L - uppercase it
            // if prior char is a spearator uppercase it
            // if following char is uppercase, uppercase it
            if (c[i] == 'l') {
                if (i == 0) {
                    sb.append('L');

                    continue;
                }

                if ((i > 0) && is_separator(c[i - 1])) {
                    sb.append('L');

                    continue;
                }

                if ((i + 1 < c.length) && is_uppercase(c[i + 1])) {
                    sb.append('L');

                    continue;
                }
            }

            sb.append(c[i]);
        }

        return sb.toString();
    }

    // *****************************************************************************
//
//  *****************************************************************************
    public static boolean invisible_chars(String s) {
        char[] c  = s.toCharArray();
        char   ci = 0;

        // boolean bCheckStatus = false;
        // bCheckStatus = check0xchars(s);
        // if(bCheckStatus) return true;
        for (int i = 0; i < c.length; i++) {
            ci = c[i];

            if ((ci >= 0) && (ci <= 31)) {
                return true;    // disallow Control Characters.
            }

            if (ci > 127) {
                return true;    // disallow the weird chars in a nickname
            }
        }

        return false;
    }

    public static boolean invisible_chars_ignore_enter(String s) {
        char[] c  = s.toCharArray();
        char   ci = 0;

        // boolean bCheckStatus = false;
        for (int i = 0; i < c.length; i++) {
            ci = c[i];

            if ((c[i] != '\r') && (c[i] != '\n')) {    // ignore enter key
                if ((ci >= 0) && (ci <= 31)) {
                    return true;                       // disallow Control Characters
                }

                if (ci > 127) {
                    return true;                       // disallow the weird chars in a nickname
                }
            }
        }

        return false;
    }

    public static boolean meta_chars(String sName) {
        String sAllow = "<>";
        char   ch;
        int    j;

        for (int i = 0; i < sName.length(); i++) {
            ch = sName.charAt(i);
            j  = sAllow.indexOf(ch);

            if (j >= 0) {
                return true;
            }
        }

        return false;
    }

    // *****************************************************************************
    public static String removeInvisibleChars(String s) {
        char[]        c   = s.toCharArray();
        char          ci  = 0;
        StringBuilder str = new StringBuilder();

        for (int i = 0; i < c.length; i++) {
            ci = c[i];

            if (((ci >= 1) && (ci <= 31)) || (ci > 127)) {
                str.append(' ');    // disallow control chars and weird chars
            } else {
                str.append(ci);
            }
        }

        return str.toString();
    }

    public static boolean isNumeric(String s) {
        try {
            int i = Integer.parseInt(s);

            // if(i<0) return false;
        } catch (java.lang.NumberFormatException e) {
            return false;
        }

        return true;
    }

    public static boolean isNumericString(String s) {
        try {
            char[] c = s.toCharArray();

            for (int i = 0; i < c.length; i++) {
                char ci = c[i];

                if (!Character.isDigit(ci)) {
                    return false;
                }
            }
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    public static boolean isNonZero(String s) {
        try {
            int i = Integer.parseInt(s);
            int j = i * 1;

            if (j == 0) {
                return false;
            }
        } catch (java.lang.NumberFormatException e) {
            return false;
        }

        return true;
    }

    public static boolean isValidTelephone(String s) {
        String  sAllow = "0123456789-";
        boolean bValid = true;
        char    ch;
        int     j;

        for (int i = 0; i < s.length(); i++) {
            ch = s.charAt(i);

            if (sAllow.indexOf(ch) == -1) {
                bValid = false;

                break;
            }
        }

        return bValid;
    }

    public static boolean isValidCreditCard(String cardNo, String cardType) {
        String digit1 = cardNo.substring(0, 1);
        String digit2 = cardNo.substring(0, 2);
        String digit3 = cardNo.substring(0, 3);
        String digit4 = cardNo.substring(0, 4);

        if (!cardType.equalsIgnoreCase("AMEX") &&!cardType.equalsIgnoreCase("DISCOVER")
                &&!cardType.equalsIgnoreCase("MC") &&!cardType.equalsIgnoreCase("VISA")
                &&!cardType.equalsIgnoreCase("DINERS")) {
            return false;
        }

        try {
            double d = Double.valueOf(cardNo).doubleValue();
        } catch (NumberFormatException e) {
            return false;
        }

        if (cardType.equalsIgnoreCase("AMEX")) {
            if (cardNo.trim().length() != 15) {
                return false;
            }

            if (!digit2.equals("34") &&!digit2.equals("37")) {
                return false;
            }
        } else if (cardType.equalsIgnoreCase("DISCOVER")) {
            if (cardNo.trim().length() != 16) {
                return false;
            }

            if (!digit4.equals("6011")) {
                return false;
            }
        } else if (cardType.equalsIgnoreCase("MC")) {
            if (cardNo.trim().length() != 16) {
                return false;
            }

            if ((digit2.compareTo("51") < 0) && (digit2.compareTo("55") > 0)) {
                return false;
            }
        } else if (cardType.equalsIgnoreCase("VISA")) {
            if ((cardNo.trim().length() != 16) && (cardNo.trim().length() != 13)) {
                return false;
            }

            if (!digit1.equals("4")) {
                return false;
            }
        } else if (cardType.equalsIgnoreCase("VISA")) {
            if (cardNo.trim().length() != 14) {
                return false;
            }

            if ((!digit2.equals("36") &&!digit2.equals("38"))
                    || ((digit3.compareTo("300") < 0) && (digit3.compareTo("305") > 0))) {
                return false;
            }
        }

        // apply LUHN Formula (mod10)
        try {
            int      j  = cardNo.length();
            String[] s1 = new String[j];

            for (int i = 0; i < cardNo.length(); i++) {
                s1[i] = "" + cardNo.charAt(i);
            }

            int checksum = 0;

            for (int i = s1.length - 1; i >= 0; i -= 2) {
                int k = 0;

                if (i > 0) {
                    k = Integer.valueOf(s1[i - 1]).intValue() * 2;

                    if (k > 9) {
                        String s = "" + k;

                        k = Integer.valueOf(s.substring(0, 1)).intValue() + Integer.valueOf(s.substring(1)).intValue();
                    }

                    checksum += Integer.valueOf(s1[i]).intValue() + k;
                } else {
                    checksum += Integer.valueOf(s1[0]).intValue();
                }
            }

            return ((checksum % 10) == 0);
        } catch (Exception e) {
            e.printStackTrace();

            return false;
        }
    }

    public static boolean isDateExpired(String mm, String yyyy) {
        try {

            // month check
            int mon = Integer.parseInt(mm);

            if ((mon < 1) || (mon > 12)) {
                return true;
            }

            // year check
            int year    = Integer.parseInt(yyyy);
            int nowyear = Calendar.getInstance().get(Calendar.YEAR);
            int nowmon  = Calendar.getInstance().get(Calendar.MONTH);
            int nowday  = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);

            if (year < nowyear) {
                return true;
            }

            if (year > (nowyear + 15)) {
                return true;
            }

            if ((year == nowyear) && (mon <= nowmon)) {
                return true;
            }
        } catch (java.lang.NumberFormatException e) {
            return true;
        }

        return false;
    }

    public static boolean isAlpha(String str) {
        char[] c = str.toCharArray();

        for (int i = 0; i < c.length; i++) {
            if (!is_letter(c[i])) {
                return false;
            }
        }

        return true;
    }

    public static boolean isAlphaOrSpace(String str) {
        char[] c = str.toCharArray();

        if (str.indexOf("  ") > 0) {
            return false;
        }

        for (int i = 0; i < c.length; i++) {
            if (!is_letter(c[i]) && (c[i] != ' ')) {
                return false;
            }
        }

        return true;
    }

    public static boolean checkLen(String txt, int min, int max) {
        if ((txt.length() < min) || (txt.length() > max)) {
            return false;
        }

        return true;
    }

    public static boolean validateEmail(String txt) {

        // must be %@%.%
        int idx1;

        if ((idx1 = txt.indexOf("@")) < 2) {
            return false;
        }

        if ((txt.indexOf(".", idx1)) < 4) {
            return false;
        }

        if (txt.indexOf("@.") >= 0) {
            return false;
        }

        return true;
    }

    public static boolean validateText(String val, int min, int max) {
        if (val == null) {
            return false;
        }

        if ((val.trim().length() < min) || (val.trim().length() > max)) {
            return false;
        }

        return true;
    }

    public static boolean isNullorEmpty(String[] p_saStr) {
        if ((p_saStr == null) || (p_saStr[0].trim().length() == 0)) {
            return true;
        }

        return false;
    }

    public static boolean isNullorEmpty(String p_sStr) {
        if ((p_sStr == null) || (p_sStr.trim().length() == 0)) {
            return true;
        }

        return false;
    }

    public static String validateAddress (String p_sStr) {
        if(isNullorEmpty(p_sStr)) return p_sStr;
        char c[] = p_sStr.toCharArray();
        String sAllow = "ACDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.,'#/&";
        for(int i = 0; i < c.length; i++) {
            if(sAllow.indexOf(c[i]) < 0) p_sStr = p_sStr.replace(c[i],' ');
        }
        return p_sStr;
    }

    public static boolean compareDateTime(char comp, java.util.Date dt1, java.util.Date dt2) {
        if (comp == '=') {
            if (dt1.equals(dt2)) {
                return true;
            } else {
                return false;
            }
        } else if (comp == '>') {
            if (dt1.after(dt2)) {
                return true;
            } else {
                return false;
            }
        } else if (comp == '<') {
            if (dt1.before(dt2)) {
                return true;
            } else {
                return false;
            }
        }

        return false;
    }

    public static boolean check_refcode(String s) {
        char[] c = s.toCharArray();

        for (int i = 0; i < c.length; i++) {
            if (!is_letter(c[i]) && (c[i] != '-') &&!Character.isDigit(c[i]) && (c[i] != '_')) {
                return false;
            }
        }

        return true;
    }

    public static boolean isLengthyWord(String p_sStr, int p_iMaxLen) {
        StringTokenizer stTokens = new StringTokenizer(p_sStr);

        while (stTokens.hasMoreTokens()) {
            if (stTokens.nextToken().length() > p_iMaxLen) {
                return true;
            }
        }

        return false;
    }

    public static boolean hasXSS(String sXSSString) {
        String[] saXSS = {"<", ">", "%26lt", "%26gt", "alert(", "document.", "prompt(", "eval.", ".cookie"};
        if(sXSSString!=null && sXSSString.trim().length()>0) {
            String[] saQStr = sXSSString.split("&");
            for(int i=0; i<saQStr.length; i++) {
                for(int j=0; j<saXSS.length; j++) {
                    if(saQStr[i].trim().toLowerCase().indexOf(saXSS[j])>=0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static boolean matchesEmailRegex(String p_sStr) {
        Matcher match = emailRegex.matcher(p_sStr);

        return match.matches();
    }

    public static boolean hasXSS2(String xssString)
    {
        boolean result = false;

        if (xssString != null && xssString.trim().length() > 0)
        {
            //result = hasXSS(xssString);

            if (!result)
            {
                for (Pattern pattern : patterns)
                {
                    if (pattern.matcher(xssString).find())
                    {
                        result = true;
                    }
                }
            }
        }

        return result;
    }

    public static boolean hasXSS3(String xssString)
    {
        boolean result = false;

        if (xssString != null && xssString.trim().length() > 0)
        {
            String regex
                    = ".*\\<[^>]+>.*";

            if (!result)
            {
                Pattern p = Pattern.compile(regex);
                if (p.matcher(xssString).find()){
                    result = true;
                }
                for (Pattern pattern : patterns)
                {
                    if (pattern.matcher(xssString).find())
                    {
                        result = true;
                    }
                }
            }
        }
        return result;
    }

    public static boolean containsXSS(String sXSSString) {
        try {
            if (sXSSString != null && sXSSString.trim().length() > 0) {
                sXSSString = URLDecoder.decode(sXSSString, "UTF-8");
                for (Pattern pattern : patterns){
                    if (pattern.matcher(sXSSString).find()){
                        return true;
                    }
                }
            }
        } catch(Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }


    public static void main(String[] args) {
        try {
            if (matchesEmailRegex("alex@bac@kpocket.com")) {
                System.out.println("match found");
            } else {
                System.out.println("match not found");
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

}
