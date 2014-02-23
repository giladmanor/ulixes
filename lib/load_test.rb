require 'net/http'

class LoadTest
  SERVER = "http://localhost:3000/api/set/"
  ACCOUNT_NUMBER = 2
  ACCOUNT_KEY = "wgQ91tTfuQ4onIOJkckiYGMCOOLmBxfI9MA4iBr44jUAvkMZvX"

  ACTIONS = ["a","move","buy","d","e","f","g","h"]

  def self.user_list(len)
    (1 .. len)
  end

  def self.do
    10.times{
      user_list(10).each{|uid|
        send({:uuid=>uid, :code=>ACTIONS.shuffle.first, :value=>1})
      }
    }

  end

  def self.send(args)
    args.merge!({
      #:with_info=>true,
      :a_id=>ACCOUNT_NUMBER,
      :k=>ACCOUNT_KEY
    })

    uri = URI.parse(SERVER)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.scheme == 'https'
    response = Net::HTTP.post_form(uri, args)
  end

end