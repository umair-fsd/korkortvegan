import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import axios from "axios";
import qs from "qs";
const ProgressScreen = () => {
  const DATA =
    "{i:1;N;i:2;N;i:27;N;i:28;N;i:29;N;i:30;N;i:31;N;i:32;N;i:33;N;i:35;N;i:36;N;i:37;N;i:38;N;i:39;N;i:40;N;i:41;N;i:42;N;i:43;N;i:44;N;i:45;N;i:46;N;i:47;N;i:48;N;i:49;N;i:50;N;i:51;N;i:52;N;i:53;N;i:54;N;i:55;N;i:57;N;i:58;N;i:59;N;i:60;N;i:61;N;i:62;N;i:63;N;i:64;N;i:65;N;i:66;N;i:67;N;i:68;N;i:69;N;i:70;N;i:71;N;i:72;N;i:73;N;i:74;N;i:75;N;i:76;N;i:77;N;i:78;N;i:79;N;i:80;N;i:81;N;i:82;N;i:83;N;i:84;N;i:85;N;i:86;N;i:87;N;i:88;N;i:89;N;i:90;N;i:91;N;i:92;N;i:93;N;i:94;N;i:95;N;i:96;N;i:97;N;i:98;N;i:99;N;i:100;N;i:101;N;i:102;N;i:103;N;i:104;N;i:105;N;i:106;N;i:108;N;i:109;N;i:111;N;i:112;N;i:113;N;i:115;N;i:116;N;i:117;N;i:118;N;i:119;N;i:120;N;i:121;N;i:122;N;i:123;N;i:124;N;i:125;N;i:126;N;i:127;N;i:128;N;i:129;N;i:130;N;i:131;N;i:132;N;i:133;N;i:134;N;i:135;N;i:136;N;i:137;N;i:138;N;i:139;N;i:140;N;i:141;N;i:142;N;i:143;N;i:144;N;i:145;N;i:146;N;i:147;N;i:148;N;i:149;N;i:150;N;i:151;N;i:152;N;i:153;N;i:154;N;i:155;N;i:156;N;i:158;N;i:159;N;i:160;N;i:161;N;i:162;N;i:163;N;i:164;N;i:165;N;i:166;N;i:167;N;i:169;N;i:170;N;i:171;N;i:172;N;i:173;N;i:174;N;i:175;N;i:176;N;i:177;N;i:178;N;i:179;N;i:180;N;i:181;N;i:182;N;i:183;N;i:184;N;i:185;N;i:186;N;i:187;N;i:188;N;i:189;N;i:190;N;i:191;N;i:192;N;i:193;N;i:194;N;i:195;N;i:196;N;i:197;N;i:198;N;i:199;N;i:200;N;i:201;N;i:202;N;i:203;N;i:204;N;i:205;N;i:206;N;i:207;N;i:209;N;i:210;N;i:211;N;i:212;N;i:213;N;i:214;N;i:215;N;i:216;N;i:217;N;i:218;N;i:219;N;i:220;N;i:221;N;i:222;N;i:223;N;i:224;N;i:225;N;i:226;N;i:227;N;i:228;N;i:229;N;i:230;N;i:231;N;i:232;N;i:233;N;i:234;N;i:235;N;i:236;N;i:237;N;i:238;N;i:239;N;i:240;N;i:241;N;i:242;N;i:243;N;i:244;N;i:245;N;i:246;N;i:247;N;i:248;N;i:249;N;i:250;N;i:251;N;i:252;N;i:253;N;i:254;N;i:255;N;i:256;N;i:257;N;i:258;N;i:259;N;i:260;N;i:261;N;i:266;N;i:268;N;i:269;N;i:270;N;i:271;N;i:272;N;i:273;N;i:274;N;i:275;N;i:276;N;i:277;N;i:278;N;i:279;N;i:280;N;i:282;N;i:283;N;i:284;N;i:285;N;i:286;N;i:287;N;i:288;N;i:289;N;i:290;N;i:291;N;i:292;N;i:293;N;i:294;N;i:295;N;i:296;N;i:297;N;i:298;N;i:299;N;i:300;N;i:301;N;i:302;N;i:303;N;i:304;N;i:305;N;i:306;N;i:307;N;i:308;N;i:309;N;i:310;N;i:311;N;i:312;N;i:313;N;i:314;N;i:315;N;i:316;N;i:317;N;i:318;N;i:319;N;i:320;N;i:321;N;i:322;N;i:323;N;i:324;N;i:325;N;i:326;N;i:327;N;i:328;N;i:329;N;i:330;N;i:332;N;i:333;N;i:334;N;i:335;N;i:336;N;i:337;N;i:338;N;i:339;N;i:340;N;i:341;N;i:342;N;i:343;N;i:344;N;i:345;N;i:346;N;i:347;N;i:348;N;i:349;N;i:350;N;i:351;N;i:352;N;i:353;N;i:354;N;i:355;N;i:356;N;i:357;N;i:358;N;i:359;N;i:360;N;i:361;N;i:362;N;i:363;N;i:364;N;i:365;N;i:366;N;i:367;N;i:368;N;i:369;N;i:370;N;i:371;N;i:372;N;i:373;N;i:374;N;i:375;N;i:376;N;i:377;N;i:378;N;i:385;N;i:386;N;i:387;N;i:388;N;i:389;N;i:390;N;i:391;N;i:392;N;i:393;N;i:394;N;i:395;N;i:396;N;i:397;N;i:398;N;i:399;N;i:400;N;i:401;N;i:402;N;i:403;N;i:404;N;i:405;N;i:406;N;i:407;N;i:408;N;i:409;N;i:410;N;i:411;N;i:412;N;i:413;N;i:414;N;i:415;N;i:416;N;i:417;N;i:418;N;i:419;N;i:420;N;i:421;N;i:422;N;i:423;N;i:424;N;i:425;N;i:426;N;i:427;N;i:428;N;i:429;N;i:430;N;i:431;N;i:432;N;i:433;N;i:434;N;i:435;N;i:436;N;i:437;N;i:438;N;i:439;N;i:440;N;i:441;N;i:442;N;i:443;N;i:444;N;i:445;N;i:446;N;i:447;N;i:448;N;i:454;N;i:455;N;i:456;N;i:457;N;i:458;N;i:459;N;i:460;N;i:461;N;i:462;N;i:463;N;i:464;N;i:465;N;i:466;N;i:467;N;i:468;N;i:469;N;i:470;N;i:471;N;i:472;N;i:473;N;i:474;N;i:475;N;i:476;N;i:477;N;i:478;N;i:479;N;i:480;N;i:481;N;i:482;N;i:483;N;i:484;N;i:485;N;i:486;N;i:487;N;i:488;N;i:489;N;i:490;N;i:491;N;i:492;N;i:493;N;i:494;N;i:495;N;i:496;N;i:497;N;i:498;N;i:499;N;i:500;N;i:501;N;i:502;N;i:503;N;i:504;N;i:505;N;i:506;N;i:507;N;i:508;N;i:509;N;i:510;N;i:511;N;i:512;N;i:513;N;i:514;N;i:515;N;i:516;N;i:517;N;i:518;N;i:519;N;i:520;N;i:521;N;i:522;N;i:523;N;i:524;N;i:525;N;i:526;N;i:527;N;i:528;N;i:529;N;i:530;N;i:531;N;i:532;N;i:533;N;i:534;N;i:535;N;i:536;N;i:538;N;i:539;N;i:540;N;i:541;N;i:542;N;i:544;N;i:545;N;i:546;N;i:547;N;i:549;N;i:550;N;i:551;N;i:552;N;i:553;N;i:554;N;i:555;N;i:556;N;i:557;N;i:558;N;i:559;N;i:560;N;i:561;N;i:562;N;i:563;N;i:564;N;i:565;N;i:566;N;i:567;N;i:568;N;i:569;N;i:570;N;i:571;N;i:572;N;i:573;N;i:574;N;i:575;N;i:576;N;i:577;N;i:578;N;i:579;N;i:580;N;i:581;N;i:582;N;i:583;N;i:584;N;i:585;N;i:586;N;i:587;N;i:588;N;i:589;N;i:590;N;i:591;N;i:592;N;i:593;N;i:594;N;i:595;N;i:596;N;i:597;N;i:598;N;i:599;N;i:600;N;i:601;N;i:602;N;i:603;N;i:604;N;i:605;N;i:606;N;i:607;N;i:608;N;i:609;N;i:610;N;i:611;N;i:612;N;i:613;N;i:614;N;i:615;N;i:616;N;i:617;N;i:618;N;i:619;N;i:620;N;i:621;N;i:622;N;i:623;N;i:624;N;i:625;N;i:626;N;i:627;N;i:628;N;i:629;N;i:630;N;i:631;N;i:632;N;i:633;N;i:634;N;i:635;N;i:636;N;i:637;N;i:638;N;i:639;N;i:640;N;i:641;N;i:642;N;i:643;N;i:644;N;i:645;N;i:646;N;i:647;N;i:648;N;i:649;N;i:650;N;i:651;N;i:652;N;i:653;N;i:654;N;i:655;N;i:656;N;i:657;N;i:658;N;i:659;N;i:660;N;i:661;N;i:662;N;i:663;N;i:664;N;i:665;N;i:666;N;i:667;N;i:668;N;i:669;N;i:670;N;i:671;N;i:672;N;i:673;N;i:674;N;i:675;N;i:676;N;i:677;N;i:678;N;i:679;N;i:680;N;i:681;N;i:682;N;i:683;N;i:684;N;i:685;N;i:686;N;i:687;N;i:688;N;i:689;N;i:690;N;i:691;N;i:692;N;i:693;N;i:694;N;i:695;N;i:696;N;i:697;N;i:698;N;i:699;N;i:700;N;i:701;N;i:702;N;i:703;N;i:704;N;i:705;N;i:706;N;i:707;N;i:708;N;i:709;N;i:710;N;i:711;N;i:712;N;i:713;N;i:714;N;i:715;N;i:716;N;i:717;N;i:718;N;i:719;N;i:720;N;i:721;N;i:722;N;i:723;N;i:724;N;i:725;N;i:726;N;i:727;N;i:728;N;i:729;N;i:730;N;i:731;N;i:732;N;i:733;N;i:734;N;i:735;N;i:736;N;i:737;N;i:738;N;i:739;N;i:740;N;i:741;N;i:742;N;i:743;N;i:744;N;i:745;N;i:746;N;i:747;N;i:748;N;i:749;N;i:750;N;i:751;N;i:752;N;i:753;N;i:754;N;i:755;N;i:756;N;i:757;N;i:758;N;i:759;N;i:760;N;i:761;N;i:762;N;i:763;N;i:764;N;i:765;N;i:766;N;}";
  const fetchDB = async () => {
    await axios
      .get(
        "https://stssodra.dimitris.in/api/getUserProgress/1?email=admin@admin.com&password=admin"
      )
      .then((res) => console.log(res.data.CorrectAnswer[0].answerStatus));
  };
  const updateDB = () => {
    axios({
      method: "put",
      url: "https://stssodra.dimitris.in/api/updateUserProgress/1",
      data: qs.stringify({
        email: "admin@admin.com",
        password: "admin",
        answerArray: DATA,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }).then((res) => console.log(res.data));
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>ProgressScreen</Text>
      <Button title="POST DATA" onPress={updateDB} />
      <Button title="Get DATA" onPress={fetchDB} />
    </View>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({});
