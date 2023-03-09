import * as React from "react";
import { useState, useRef,useContext,useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Platform
} from "react-native";
import { CheckBox } from "@rneui/themed";
import screenSty from "../../style/screenSty";
import InstalHeader from "../common/instalProgress";
import ButtonGroup from "../common/nextButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import Loader from "./../common/Loader";
import { color } from "../../config/configuration";
import { Unit } from "../Unit";
import { addResidentAddress, getCompanyById, getCompanyDetails, getResidents, selectCompant, setTermsAndCondition } from "../../redux/Actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const TermsAndConditionsScreen = ({ route,navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth} = useContext(StateContext)
  const back = route.params?.back;
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isLodering, setIsLodering] = useState(false);
  const scrollViewRef = useRef();
  const isFocused = useIsFocused();
  useEffect(() => {
    setToggleCheckBox(auth?.user_details.terms_and_condition);
    return () => { }
 }, [isFocused]);

  const nextBut = async () => {
    if (toggleCheckBox) {
      try {
        setIsLodering(true);
        let term =await setTermsAndCondition(auth?.token, auth?.user_details.id);

        if(term.status){

          auth.user_details.terms_and_condition = true;
          await AsyncStorage.setItem('userInfo',JSON.stringify(auth) );
          
            if(auth?.user_details.company_id==null || back){
              navigation.navigate("address");
            }else{
              if(auth?.user_details.role_id==9 ){
                navigation.navigate("main");
              }else{
                getCompanyDetails( auth?.token,auth?.user_details.company_id).then(async (com)=>{ 
                  selectCompant(com.data);
                  let company = com.data
                  addResidentAddress(company.address, company.address_line_2, company.city, company.state, company.zip,company.country)
                  getCompanyResidnts( auth?.user_details.company_id);
                });
              }
            }

        }
      } catch (error) {
        setIsLodering(false);
        Unit.alertMes("Please try again to process");
        return ;
      }
    } else {
      Unit.alertMes("Please accept terms and conditions");
    }
  };
  const getCompanyResidnts = async (id)=>{
    await getResidents(auth?.token, id).then(async (residentList)=>{
      setIsLodering(false)
      if (!residentList || residentList.length == 0 ) {  
        navigation.navigate("resident");
      }else{
        navigation.navigate("main");
      }
    })
  }

  return (
    <SafeAreaView style={[screenSty.contant, screenSty.backgroundWColor]}>
      <View style={[screenSty.contant, screenSty.margin15H]}>
        <InstalHeader navigation={navigation} progress={0.2} />
        <View
          style={[ screenSty.bigcontainer,styles.marginTop20]}
        >
          <ScrollView ref={scrollViewRef} style={screenSty.padding15H}>
            <Text
              style={{
                marginVertical: 10,
                textAlign: "center",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              Master Services Agreement
            </Text>
            <Text style={{ color: "#000", textAlign: "justify" }}>
              This Master Services Agreement (hereinafter referred as{" "}
              <Text style={{ fontWeight: "bold" }}>“Agreement”</Text>) is
              between the person using the Device and/or the person using the
              Application and/or Dashboard (to the extent applicable), on the
              one hand and Lifestyle Evolution Inc. d/b/a WellAware Care”), on
              the other hand. Each party shall be individually referred as
              “Party” and jointly referred as “Parties”.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              1.
              <Text style={{ textDecorationLine: "underline" }}>
                Certain Defined Terms.
              </Text>{" "}
              For brevity, clarity and simplicity, this Agreement contains a
              number of capitalized, defined terms.{" "}
              <Text style={{ fontWeight: "bold" }}>“Agreement”</Text> means this
              agreement. <Text style={{ fontWeight: "bold" }}>“End-User”</Text>{" "}
              means the person using the Device{" "}
              <Text style={{ fontWeight: "bold" }}>“Emergency Contact”</Text>{" "}
              means the person using the Device mobile application and/or the
              Dashboard. <Text style={{ fontWeight: "bold" }}>“Device”</Text>{" "}
              means the devices as attached to the WellAware Care dashboard
              through webhooks or API’s (as applicable) which could include fall
              detection device, additional detection capabilities and any
              accessories or devices we provide you. “Application” means the
              WellAware Care aggregator application (as applicable) either
              portal or mobile application installed by the system integrators
              or Emergency Contact for use with the Devices and any related
              software, websites, updates, corrections, content, and
              documentation.{" "}
              <Text style={{ fontWeight: "bold" }}>“Dashboard”</Text> means the
              WellAware Care Dashboard (as applicable) browser dashboard used by
              the Emergency Contact and/or End Users for use with the Device
              and/or Application and any related software, websites, updates,
              content, and documentation.{" "}
              <Text style={{ fontWeight: "bold" }}>“Wi-Fi”</Text> means the
              Wi-Fi network installed in your home and to which the Device is
              connected.{" "}
              <Text style={{ fontWeight: "bold" }}>“Responders”</Text> means any
              person or entity that may respond to an alert or a call from the
              Emergency Contact, including any police, fire, or medical
              personnel.{" "}
              <Text style={{ fontWeight: "bold" }}>“Smartphone”</Text> means any
              phone where the Application is installed, or phone number selected
              for Emergency Contact. Company is sometimes referred to as{" "}
              <Text style={{ fontWeight: "bold" }}>“we,” “us”</Text> or{" "}
              <Text style={{ fontWeight: "bold" }}>“our”</Text>. The End-User
              and the Emergency Contact are each sometimes referred to in this
              Agreement as{" "}
              <Text style={{ fontWeight: "bold" }}>“you”, “your”,</Text> or{" "}
              <Text style={{ fontWeight: "bold" }}>“buyer”</Text>. The{" "}
              <Text style={{ fontWeight: "bold" }}>“Alert Service”</Text> is
              defined in the paragraph entitled “Alert Service” below. Other
              defined terms are capitalized throughout the balance of the
              Agreement. Whether or not capitalized, the word “including” is not
              a word of limitation but means “including, without limitation or
              example”. In this Agreement, the term{" "}
              <Text style={{ fontWeight: "bold" }}>“Representatives”</Text> (as
              defined in the Limitation of Liability below) means each and any
              of the Representatives.
            </Text>
            <Text
              style={{ color: "#000", marginTop: Platform.OS == 'android' ? -20 : 20, textAlign: "justify" }}
            >
              2.
              <Text style={{ textDecorationLine: "underline" }}>
                The License.
              </Text>{" "}
              Subject to the terms and conditions of this Agreement, Company
              grants End-User and Emergency Contact each a limited,
              non-exclusive, non-transferable, non-commercial license to install
              and use the Device, the Dashboard, and Application in accordance
              with this Agreement. All software, firmware, shareware, codes,
              information and documentation arising out of or from the Device,
              the Dashboard, and the Application are our sole and exclusive
              property and you have no rights in any of the foregoing. The
              Company reserves all rights not expressly granted to you. This
              Agreement will govern any software upgrades that replace and/or
              supplement software in the Device, the Dashboard or the
              Application, unless such upgrade is accompanied by a separate
              license in which case the terms of that license will govern.
              Company alone owns all content on the Application and the
              Dashboard. WE MAY PROVIDE AND CHARGE FOR UPGRADES, UPDATED
              VERSIONS, BUGS AND FIXES. WE MAY REQUIRE PAYMENT OF PERIODIC FEES
              FOR USE OF ANY UPGRADED OR UPDATED APPLICATION AND DASHBOARD. You
              acknowledge that “WellAware Care” and “Lifestyle Evolution inc,”
              are trade names that belong to Company and you have no right in
              either or in any related trade names or trademarks. WE MAY MODIFY,
              TERMINATE OR SUSPEND ANY FORM OF SERVICE TO YOU OR THIS AGREEMENT
              ON REASONABLE NOTICE TO YOU.
            </Text>
            <View>
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "#000",
                  marginTop: 10,
                }}
              >
                3. The Alert Service
              </Text>
            </View>
            <Text
              style={{ marginLeft: 20, color: "#000", textAlign: "justify" }}
            >
              3.1.{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                  textAlign: "justify",
                }}
              >
                With respect to WellAware Care Devices –
              </Text>{" "}
              if the Device detects a fall or as other alerts as defined by
              WellAware Care, the Device will send an alert to the Application
              on the Smartphone or a text message to your or to any other
              Emergency Contact’s Smartphone (message and data rates may apply)
              and also send an alert to the Dashboard, as applicable. Note: ONLY
              THE EMERGENCY CONTACT MONITORS THE DEVICE, THE DASHBOARD AND
              APPLICATION.
            </Text>
            <Text style={{ color: "#000", textAlign: "justify" }}>
              4.
              <Text style={{ textDecorationLine: "underline" }}>
                How long this Agreement Lasts.
              </Text>
              This Agreement lasts for as long as the End-User and Emergency
              Contact use the Device, the Dashboard and Application. You can
              stop using the Alert Service at any time by writing an email to{" "}
              <Text style={{ color: "rgb(113,101,227)" }}>
                StopService@Leiots.com
              </Text>
              . We reserve the right to suspend or terminate your access to the
              Alert Service with notice to You if: (a) You are in breach of this
              Agreement; (b) You are using the Alert Service in a manner that
              would cause a real risk of harm or loss to us or other users; or
              (c) You are not paying the monthly fees during at least 1 month,
              assuming you were obliged to do so. If you enter into some other
              written agreement with Company, then that other agreement may take
              the place of this Agreement. Your obligations under this Agreement
              shall survive expiration or termination of this Agreement. WE MAY
              TERMINATE THIS AGREEMENT FOLLOWING NOTICE TO THE EMERGENCY CONTACT
              SENT VIA THE APPLICATION AND/OR DASHBOARD FOR GOOD CAUSE,
              INCLUDING THE BREACH BY END-USER OR EMERGENCY CONTACT OF THIS
              AGREEMENT.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              5.
              <Text style={{ textDecorationLine: "underline" }}>
                Device Installation and Use; Application Set-Up and Use;
                Dashboard Set-Up and Use.
              </Text>
              You must follow our written requirements for the: (i) installation
              and use of the Device (the{" "}
              <Text style={{ fontWeight: "bold" }}>
                “Installation and Use Requirements”
              </Text>
              ) and (ii) set-up and use of the Application and the Dashboard
              (the{" "}
              <Text style={{ fontWeight: "bold" }}>
                “Application Requirements”
              </Text>{" "}
              and{" "}
              <Text style={{ fontWeight: "bold" }}>
                “Dashboard Requirements”
              </Text>
              , respectively). The Installation and Use Requirements are set
              forth in the booklet in the box used to ship the Device to you.
              The Installation and Use Requirements, the Application
              Requirements and the Dashboard Requirements (together, the
              “Requirements”) will be sent to you by us once you purchase the
              Device. The Requirements are incorporated by reference in and
              forms an integral part of this Agreement. You agree that we may
              modify the Requirements from time-to-time by notice to you sent
              via the Application and/or Dashboard. You shall abide by all laws
              when you use the Device, the Dashboard and the Application. YOU
              MAY NOT DISTRIBUTE OR MAKE THE APPLICATION AND DASHBOARD AVAILABLE
              OVER A NETWORK WHERE IT COULD BE USED BY MULTIPLE ACCOUNTS AT THE
              SAME TIME. YOU MAY NOT RESELL THE DEVICE, THE DASHBOARD OR THE
              APPLICATION OR USE THE DEVICE, THE DASHBOARD OR APPLICATION FOR
              ANY COMMERCIAL USE.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              6.
              <Text style={{ textDecorationLine: "underline" }}>
                Data and Privacy.
              </Text>{" "}
              We may collect and retain certain data regarding the use of the
              Device, the Dashboard and the Application (the{" "}
              <Text style={{ fontWeight: "bold" }}>“Data”</Text>) but we will do
              so on a de-identified (meaning you will be anonymous). Our privacy
              policy can be found at{" "}
              <Text style={{ color: "rgb(113,101,227)" }}>
                www.WellAwarecare.com/docs/privacy-policy
              </Text>
              . The privacy policy is incorporated by reference in, and forms an
              integral part of, this Agreement. YOU MAY NOT PERMIT OTHERS TO
              BREACH THE SECURITY OF THE DEVICE, DASHBOARD OR APPLICATION.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              7.
              <Text style={{ textDecorationLine: "underline" }}>
                Intellectual Property.
              </Text>{" "}
              You will not, directly or indirectly, copy, decompile, reverse
              engineer, disassemble, attempt to derive the source code of,
              decrypt, modify or create derivative works of the Device or any of
              its components or software. You must keep all usernames and
              passwords confidential. You alone assume the risk that any
              unauthorized person gains access or control of the Device, any
              Data, the Dashboard, or the Application.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              8.
              <Text style={{ textDecorationLine: "underline" }}>
                Certain Use Restrictions.
              </Text>{" "}
              You shall not, and shall not permit any third party to: (i) make
              the Application and/or Dashboard available over a network where it
              could be used by multiple devices owned or operated by different
              people at the same time; (ii) circumvent, disable or otherwise
              interfere with security-related features of the Device, Dashboard
              or Application, or features that prevent or restrict use or
              copying of any content or that enforce limitations on use of the
              Device, Application or Dashboard; (iii) remove, alter or obscure
              any proprietary notice or identification, including copyright,
              trademark, patent or other notices, contained in or displayed on
              or via the Device, Application or Dashboard; (iv) use Company’s
              name, logo or trademarks without our prior written consent; or (v)
              use the Device, Application or Dashboard for any unlawful,
              harmful, irresponsible, or inappropriate purpose, or in any manner
              that breaches this Agreement.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              9.
              <Text style={{ textDecorationLine: "underline" }}>
                OUR LIABILITY TO YOU AND TO OTHERS IS LIMITED.
              </Text>{" "}
              IF ANY LIABILITY ARISES ON THE PART OF COMPANY OR ANY OF COMPANY’S
              OFFICERS, MANAGERS, MEMBERS, AFFILIATES, PARTNERS, EMPLOYEES,
              MANUFACTURERS, SUPPLIER OR SUB-CONTRACTORS (COLLECTIVELY,
              “REPRESENTATIVES”) FOR ANY PERSONAL INJURY OR DEATH OR ANY OTHER
              LOSS, DAMAGE, COST OR EXPENSE, PROPERTY DAMAGE OR OTHER LIABILITY
              ARISING OUT OF OR FROM ANY THEORY OF LIABILITY, INCLUDING TORT
              (WHETHER NEGLIGENT, INTENTIONAL OR OTHERWISE), CONTRACT, PRODUCT
              LIABILITY, STRICT LIABILITY, CONTRIBUTION, INDEMNIFICATION, BREACH
              OF A STATUTE OR OTHER RULE OR STANDARD OR ANY OTHER POSSIBLE CLAIM
              SUCH LIABILITY SHALL NOT EXCEED $2,500 OR SUCH OTHER AMOUNT AS
              PERMITTED BY ANY APPLICABLE STATE OR FEDERAL STATUTE THAT THE
              COMPANY MAY VIOLATE, COLLECTIVELY FOR COMPANY AND REPRESENTATIVES.
              IN ADDITION TO ANY OTHER PROVISION IN THIS AGREEMENT, NEITHER
              COMPANY NOR REPRESENTATIVES WILL BE LIABLE TO YOU OR ANY OTHER
              PERSON OR ENTITY FOR ANY INDIRECT, SPECIAL, EXEMPLARY, PUNITIVE,
              INCIDENTAL OR CONSEQUENTIAL DAMAGES, EVEN IF COMPANY HAS BEEN
              ADVISED OF THE POTENTIAL FOR SUCH DAMAGES.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              10.
              <Text style={{ textDecorationLine: "underline" }}>
                You are Responsible for False Alarms and Forced Entry.
              </Text>{" "}
              If the Device is activated for any reason and any alert is sent to
              the Application and/or Dashboard resulting in the dispatch of
              Responders, you alone shall pay any fines, fees, costs, expenses,
              or penalties assessed against you or Company by any court or
              governmental agency. You must provide any emergency Responders
              access to the premises. If you fail to provide access, Responders
              may use force to enter the premises, and that may result in
              damage. You alone are responsible for any such damage. Company has
              no control over response times for Responders. You hereby release
              Company and Responders from all claims, losses and damages that
              may arise from any forced entry or delayed response.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              11.
              <Text style={{ textDecorationLine: "underline" }}>
                You Release Us for Circumstances Beyond Our Control.
              </Text>{" "}
              Our obligations will be waived automatically and we will not be
              liable to you or any other person or entity if we are unable to
              provide the Device, Dashboard or Application or if the Device,
              Dashboard or Application do not work because or as a result of, or
              in connection with, any circumstances beyond our control,
              including any loss of communications, including the loss of Wi-Fi,
              the Network, the Internet or any other communications network such
              as any telephone, radio or other network, or any flood, fire,
              earthquake, explosion, civil unrest, war, invasion, terrorism,
              labor unrest, or other acts of God in any such case for the
              duration of such circumstance.
            </Text>
            <Text style={{ color: "#000", textAlign: "justify" }}>
              12.
              <Text style={{ textDecorationLine: "underline" }}>
                LIMITED WARRANTY.
              </Text>{" "}
              F THE DEVICE BECOMES DEFECTIVE DUE TO A DEFECT IN MATERIALS,
              WORKMANSHIP OR DESIGN WITHIN 6 MONTHS OF YOUR PURCHASE, COMPANY
              WILL REPLACE THE DEVICE. THIS IS COMPANY’S SOLE WARRANTY. THIS
              LIMITED WARRANTY CAN ONLY BE USED BY THE ORIGINAL DEVICE PURCHASER
              AND IS NOT ASSIGNABLE. YOU MUST RETURN THE DEVICE TO COMPANY’S
              DESIGNATED LOCATION SO THAT WARRANTY SERVICE MAY BE RENDERED. THIS
              WARRANTY DOES NOT COVER DAMAGE CAUSED BY ACCIDENT, VANDALISM,
              NEGLIGENCE OR MISTAKE, VIOLATION OF THE INSTALLATION AND USE
              REQUIREMENTS, FLOOD, WATER, LIGHTNING, FIRE, ABUSE, MISUSE, ACTS
              OF GOD, CASUALTY (INCLUDING ELECTRICITY), NEGLECT, ATTEMPTED
              UNAUTHORIZED REPAIR SERVICE BY ANYONE OTHER THAN COMPANY, OR ANY
              OTHER CAUSE (EXCLUDING ORDINARY WEAR AND TEAR). THE APPLICATION,
              DASHBOARD AND SOFTWARE USED IN CONNECTION WITH THE DEVICE ARE
              PROVIDED “AS IS” AND “AS AVAILABLE” AND WITH ALL FAULTS AND
              DEFECTS WITHOUT WARRANTY OF ANY KIND (EXPRESS OR IMPLIED) EXCEPT
              THAT WE WARRANT TO YOU ONLY THAT, TO COMPANY’S ACTUAL KNOWLEDGE,
              COMPANY HAS THE LEGAL RIGHT TO GRANT THE RIGHTS AND LICENSE TO YOU
              UNDER THIS AGREEMENT. WE DO NOT WARRANT THAT THE APPLICATION,
              DASHBOARD OR SOFTWARE USED IN THE DEVICE WILL BE ERROR-FREE OR
              WILL NOT CONTAIN VIRUSES OR OTHER HARMFUL CODE.
            </Text>
            <Text style={{ color: "#000", textAlign: "justify" }}>
              13.
              <Text style={{ textDecorationLine: "underline" }}>
                DISCLAIMER.
              </Text>{" "}
              THE DEVICE, THE DASHBOARD AND APPLICATION ARE NOT A SUBSTITUTE FOR
              ANY EMERGENCY TELEPHONE NUMBER, INCLUDING BUT NOT LIMITED TO 911.
              IF YOU NEED HELP AND ARE ABLE TO DIAL 911 OR ANY OTHER PUBLIC
              EMERGENCY SERVICE, YOU SHOULD DO SO. IN ADDITION, YOU ACKNOWLEDGE
              THAT ALL DATA REPORTED BY THE DASHBOARD, INCLUDING BUT NOT LIMITED
              TO THE QUANTITY OF FALL DETECTIONS, SHALL NOT BE CONSIDERED AS
              CLINICAL DATA IN ANY WAY WHATSOEVER. YOU ACKNOWLEDGE THAT THE
              NATURE OF SUCH REPORTS, SHALL NOT, UNDER ANY CIRCUMSTANCES, BE
              INTERPRETED AS CLINICAL DATA. YOU ALSO ACKNOWLEDGE THAT DEVICES
              ARE NOT A LIFESAVING DEVICE AND SHOULD NOT BE CLAIMED AS SUCH,
              MISREPRESENTED AS SUCH OR BELIEVED TO BE MORE THAN A INFORMATION
              SYSTEM AND SHOULD NOT BE RELIED ON TO MAKE CLINICAL DECISIONS OR
              REPRESENTED AS SUCH.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              14.
              <Text style={{ textDecorationLine: "underline" }}>
                Applicable Law and Governing law.
              </Text>{" "}
              This Agreement will be governed by and construed according to the
              laws of the state of Massachusetts and the courts in BOSTON shall
              have the exclusive jurisdiction in case of any disputes without
              reference to its conflicts of law rules. The interpretation of
              this Agreement will not be construed against the drafter.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              15.
              <Text style={{ textDecorationLine: "underline" }}>
                Assignment.
              </Text>{" "}
              You may not assign this Agreement. We may assign this Agreement or
              any portion thereof. If we assign this Agreement, we are released
              from all liabilities or obligations that may arise after the
              assignment.
            </Text>
            <Text style={{ color: "#000", textAlign: "justify" }}>
              16.
              <Text style={{ textDecorationLine: "underline" }}>
                No Waiver of Breach.
              </Text>{" "}
              Waiver of any breach of this Agreement will not be a waiver of any
              subsequent breach. Our rights under this Agreement will be
              cumulative, and may be exercised concurrently or consecutively,
              and will include all remedies, even those remedies not referred to
              in this Agreement.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              17.
              <Text style={{ textDecorationLine: "underline" }}>
                Integration; Amendment.
              </Text>{" "}
              This Agreement contains the entire agreement between you and us
              concerning the subject matters of this Agreement and supersedes
              all prior or current negotiations, commitments, contracts, express
              or implied, warranties, express or implied, statements and
              representations, written or oral, pertaining to such matters, all
              of which are merged into this Agreement. Any amendment of this
              Agreement must be in a writing signed by both parties.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              18.
              <Text style={{ textDecorationLine: "underline" }}>
                Severability.
              </Text>{" "}
              If any provision hereof (or portion thereof), or its application
              to any circumstances, is held illegal, invalid, or unenforceable
              to any extent, the validity and enforceability of the remainder of
              the provision and this Agreement, or of such provisions as applied
              to any other circumstances, will not be affected, and will remain
              in full force and effect as valid, binding and continuing.
            </Text>
            <Text style={{ color: "#000", textAlign: "justify" }}>
              19.
              <Text style={{ textDecorationLine: "underline" }}>
                Contractual Limitation of Actions.
              </Text>{" "}
              All claims, actions, or proceedings by or against Company or
              Representatives must be commenced in court within 1 year after the
              cause of action has accrued, without judicial extension of time,
              or such claim, action or proceeding is barred. The time period in
              this paragraph must be complied with strictly.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              20.
              <Text style={{ textDecorationLine: "underline" }}>
                Headings; Construction.
              </Text>{" "}
              The paragraph titles used herein are for convenience of the
              parties only and will not be considered in construing the
              provisions of this Agreement.
            </Text>
            <Text
              style={{ color: "#000", marginTop: 10, textAlign: "justify" }}
            >
              <Text style={{ textDecorationLine: "underline" }}>
                Note: Distributor Requirements and Usage Rules.
              </Text>{" "}
              If you download the Application from the Apple, Inc. (“Apple”) App
              Store (or in any event if you download an Apple iOS application)
              then your use of the Application is also subject to the Usage
              Rules established by Apple, including those set forth in the Apple
              App Store Terms of Service, effective as of the date that you
              enter into this Agreement;
            </Text>
            <View
              style={{ flexDirection: "row", marginTop: 0, marginBottom: 20 }}
            >
              <CheckBox
                checkedColor="rgb(113,101,227)"
                checkedIcon="check-square"
                uncheckedIcon="square-o"
                checked={toggleCheckBox}
                onPress={(newValue) => setToggleCheckBox(!toggleCheckBox)}
              />
              <Text
                style={{
                  marginLeft: -20,
                  color: "#000",
                  fontWeight: "bold",
                  marginTop: 18,
                }}
              >
                {t('I agree')}
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }}
          >
            <View style={styles.scrollBut}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Icon type="font-awesome" name="angle-double-down" size={30} color={color.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ButtonGroup
        onClickNext={nextBut}
        onClickBack={()=>navigation.navigate("start")}
        disabledNext={!toggleCheckBox}
      />
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollBut: {
    position: "absolute",
    zIndex: 99,
    backgroundColor: "#ebe6fb",
    width: 40,
    height: 40,
    borderRadius: 20,
    right: 5,
    bottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  marginTop20: {
    marginTop: 20,
  },
  image: {
    width: "100%",
    resizeMode: "stretch",
  },
});

export default TermsAndConditionsScreen;
