(function(){SyntaxHighlighter=SyntaxHighlighter||(typeof require!=="undefined"?require("shCore").SyntaxHighlighter:null);function a(){var b="alias and BEGIN begin break case class def define_method defined do each else elsif END end ensure false for if in module new next nil not or raise redo rescue retry return self super then throw true undef unless until when while yield";var c="Array Bignum Binding Class Continuation Dir Exception FalseClass File::Stat File Fixnum Fload Hash Integer IO MatchData Method Module NilClass Numeric Object Proc Range Regexp String Struct::TMS Symbol ThreadGroup Thread Time TrueClass";this.regexList=[{regex:SyntaxHighlighter.regexLib.singleLinePerlComments,css:"comments"},{regex:SyntaxHighlighter.regexLib.doubleQuotedString,css:"string"},{regex:SyntaxHighlighter.regexLib.singleQuotedString,css:"string"},{regex:/\b[A-Z0-9_]+\b/g,css:"constants"},{regex:/:[a-z][A-Za-z0-9_]*/g,css:"color2"},{regex:/(\$|@@|@)\w+/g,css:"variable bold"},{regex:new RegExp(this.getKeywords(b),"gm"),css:"keyword"},{regex:new RegExp(this.getKeywords(c),"gm"),css:"color1"}];this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags)}a.prototype=new SyntaxHighlighter.Highlighter();a.aliases=["ruby","rails","ror","rb"];SyntaxHighlighter.brushes.Ruby=a;typeof(exports)!="undefined"?exports.Brush=a:null})();