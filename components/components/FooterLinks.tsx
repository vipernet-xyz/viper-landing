export default function FooterLinks() {
  return (
    <div className="flex gap-12 py-12 lg:py-24 px-4">
      <div className="font-bold text-white font-space-grotesk">
        <h3 className="text-xl mb-2">+ Resources:</h3>
        <div className="space-y-2">
          <p>Blogs</p>
          <p>Doc</p>
        </div>
      </div>

      <div className="font-bold text-white font-space-grotesk">
        <h3 className="text-xl mb-2">+ Community:</h3>
        <div className="space-y-2">
          <p>X [Twitter]</p>
          <p>Github</p>
          <p>Discord</p>
          <p>Medium</p>
          <p>Mail</p>
        </div>
      </div>
    </div>
  );
}
