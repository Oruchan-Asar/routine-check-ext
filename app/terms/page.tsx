import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto mt-16 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Privacy Policy for Routine Check Extension</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  1. Data Collection and Usage
                </h2>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  1.1 Data We Collect
                </h3>
                <p>
                  The Routine Check Extension (&quot;we&quot;, &quot;our&quot;,
                  or &quot;the extension&quot;) collects the following data:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Routine tasks and schedules created by users</li>
                  <li>User preferences and settings</li>
                  <li>Authentication data for maintaining user sessions</li>
                </ul>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  1.2 How We Collect Data
                </h3>
                <p>Data is collected through:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Direct user input in the extension popup interface</li>
                  <li>Browser storage API for saving local preferences</li>
                  <li>Cookie data for maintaining authentication state</li>
                </ul>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  1.3 Purpose of Data Collection
                </h3>
                <p>We collect this data solely for:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Storing and managing your routine tasks</li>
                  <li>Syncing your routines with your calendar</li>
                  <li>Maintaining your user session</li>
                  <li>Improving the functionality of the extension</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  2. Data Storage and Security
                </h2>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  2.1 Local Storage
                </h3>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Routine data and preferences are stored locally in your
                    browser using Chrome&apos;s storage API
                  </li>
                  <li>No sensitive data is stored in plain text</li>
                </ul>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  2.2 Server Communication
                </h3>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Data is only transmitted between the extension and our
                    designated backend server
                  </li>
                  <li>
                    All communication is secured using standard HTTPS protocols
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  3.1 Third-Party Sharing
                </h3>
                <p>
                  We do not share your data with any third parties. Your data is
                  only used within:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Your local browser storage</li>
                  <li>Our backend service for synchronization purposes</li>
                </ul>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  3.2 Service Providers
                </h3>
                <p>The only parties with access to your data are:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Our backend service (for data synchronization)</li>
                  <li>Your browser&apos;s local storage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  4. User Rights and Control
                </h2>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  4.1 Your Rights
                </h3>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Access your stored routine data at any time</li>
                  <li>Modify or delete your routines</li>
                  <li>Clear all local data</li>
                  <li>
                    Uninstall the extension, which will remove all local data
                  </li>
                </ul>

                <h3 className="text-xl font-medium mt-4 mb-2">
                  4.2 Data Deletion
                </h3>
                <p>You can delete your data by:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Using the deletion features within the extension</li>
                  <li>Uninstalling the extension</li>
                  <li>Contacting us for complete account deletion</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  5. Changes to Privacy Policy
                </h2>
                <p>
                  We reserve the right to update this privacy policy. Users will
                  be notified of any significant changes through the extension
                  interface.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  6. Contact Information
                </h2>
                <p>For any questions or concerns about your privacy:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Email: oruchan.asar@gmail.com</li>
                  <li>
                    Website:{" "}
                    <Link
                      className="text-blue-700"
                      href="https://oruchanasar.com"
                    >
                      oruchanasar.com
                    </Link>
                  </li>
                  <li>Address: Turhal/Tokat/Turkey</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Compliance</h2>
                <p>This privacy policy complies with:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Chrome Web Store Developer Program Policies</li>
                  <li>General data protection principles</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
