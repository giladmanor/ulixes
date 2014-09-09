class MailChimp
  
  def initialize
    @config = YAML.load_file("#{Rails.root}/config/mailchimp_config.yml.ignore")["mailchimp"]
    @api = Mailchimp::API.new(@config["api_key"])
  end

  def subscribe(uid,email, grouping,groups)
    user = {"email"=>email,"leid"=>uid}
    group = @config[grouping]
    merge_vars = {
      'GROUPINGS'=> [
        {
          'name'=> group["name"],
          'groups'=> groups.map{|v| group[v]}.join(",")
        }
      ]
    }
    @api.lists.subscribe(@config["list_id"], user,merge_vars,'html', true)
  end
  
  def self.handle(params)
    i = MailChimp.new
    puts [params["uid"],params["email"],params["grouping"],params["groups"]].join(" _ ")
    puts i.subscribe(params["uid"],params["email"],params["grouping"],params["groups"])
    puts "*"*40
  end

end