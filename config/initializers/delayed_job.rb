# Delayed Job Initializer

Delayed::Worker.destroy_failed_jobs = false
Delayed::Worker.sleep_delay = 20
Delayed::Worker.max_attempts = 5
Delayed::Worker.max_run_time = 4.hour
Delayed::Worker.delay_jobs = !Rails.env.test?

workers = 2


if Rails.env.production? || Rails.env.development?
  # Check if the delayed job process is already running
  # Since the process loads the rails env, this file will be called over and over
  # Unless this condition is set.
  pids = Dir.glob(Rails.root.join('tmp','pids','*'))
  
  system "echo \"delayed_jobs INIT check\""
  if pids.select{|pid| pid.start_with?(Rails.root.join('tmp','pids','delayed_job.init').to_s)}.empty?
    
    f = File.open(Rails.root.join('tmp','pids','delayed_job.init'), "w+") 
    f.write(".")
    f.close
    system "echo \"Restatring delayed_jobs...\""
    system "RAILS_ENV=#{Rails.env} #{Rails.root.join('bin','delayed_job')} stop"
    system "RAILS_ENV=#{Rails.env} #{Rails.root.join('bin','delayed_job')} -n #{workers} start"
    system "echo \"delayed_jobs Workers Initiated\""
    File.delete(Rails.root.join('tmp','pids','delayed_job.init')) if File.exist?(Rails.root.join('tmp','pids','delayed_job.init'))
    
  else
    system "echo \"delayed_jobs is running\""
  end
end

